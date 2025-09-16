import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@tofi/database';
import { verifyPassword } from '@tofi/database';
import type { UserRole } from '@tofi/types';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mfaCode: { label: 'MFA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        // Check MFA if enabled
        if (user.isMfaEnabled && !credentials.mfaCode) {
          throw new Error('MFA_REQUIRED');
        }

        if (user.isMfaEnabled && credentials.mfaCode) {
          const { verifyMfaToken } = await import('./mfa');
          const isValidMfa = verifyMfaToken(user.mfaSecret!, credentials.mfaCode);
          if (!isValidMfa) {
            throw new Error('INVALID_MFA');
          }
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          role: user.role as UserRole,
          language: user.language,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.role = user.role;
        token.language = user.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.language = token.language as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-in
      if (account?.provider === 'google' && profile?.email) {
        const existingUser = await db.user.findUnique({
          where: { email: profile.email },
        });

        if (!existingUser) {
          // Create new user from OAuth profile
          await db.user.create({
            data: {
              email: profile.email,
              firstName: profile.given_name || 'User',
              lastName: profile.family_name || '',
              image: profile.picture,
              emailVerified: new Date(),
              role: 'CUSTOMER',
              language: 'de-CH',
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`);
      }
    },
    async signOut({ session }) {
      console.log(`User ${session?.user?.email} signed out`);
    },
  },
};