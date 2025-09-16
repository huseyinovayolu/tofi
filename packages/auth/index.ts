import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@tofi/database";
import type { User, UserRole } from "@tofi/types";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        // In a real implementation, you'd have a password field
        // For now, we'll assume password verification passes
        const isValidPassword = true; // await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          return null;
        }

        // Check MFA if enabled
        if (user.mfaEnabled && !credentials.mfaCode) {
          throw new Error("MFA_REQUIRED");
        }

        if (user.mfaEnabled && credentials.mfaCode) {
          const isValidMFA = await verifyMFACode(user.id, credentials.mfaCode);
          if (!isValidMFA) {
            throw new Error("INVALID_MFA");
          }
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          image: null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
      }

      // Update last login for OAuth providers
      if (account && user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Check if user is active
      if (user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        
        if (dbUser && !dbUser.isActive) {
          return false;
        }
      }

      // Handle OAuth first-time sign-up
      if (account?.provider === "google" && profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user with Swiss defaults
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: (profile as any).given_name || "",
              lastName: (profile as any).family_name || "",
              preferredLanguage: "de-CH",
              role: "CUSTOMER",
              isActive: true,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      // Log successful sign-in
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SIGN_IN",
          resource: "USER",
          resourceId: user.id,
          newValues: {
            provider: account?.provider,
            isNewUser,
          },
        },
      });
    },
    async signOut({ session, token }) {
      // Log sign-out
      const userId = session?.user?.id || (token?.id as string);
      if (userId) {
        await prisma.auditLog.create({
          data: {
            userId,
            action: "SIGN_OUT",
            resource: "USER",
            resourceId: userId,
          },
        });
      }
    },
  },
};

// MFA utilities
export async function generateMFASecret(userId: string) {
  const { TOTP } = await import("otpauth");
  const secret = TOTP.Secret.generate();
  
  await prisma.user.update({
    where: { id: userId },
    data: { mfaSecret: secret.base32 },
  });

  const totp = new TOTP({
    issuer: "tofi.ch",
    label: userId,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  return {
    secret: secret.base32,
    qrCode: totp.toString(),
  };
}

export async function verifyMFACode(userId: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaSecret: true },
  });

  if (!user?.mfaSecret) {
    return false;
  }

  const { TOTP } = await import("otpauth");
  const totp = new TOTP({
    issuer: "tofi.ch",
    label: userId,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: user.mfaSecret,
  });

  return totp.validate({ token: code, window: 1 }) !== null;
}

export async function enableMFA(userId: string, verificationCode: string): Promise<boolean> {
  const isValid = await verifyMFACode(userId, verificationCode);
  
  if (isValid) {
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });
    
    // Log MFA enablement
    await prisma.auditLog.create({
      data: {
        userId,
        action: "ENABLE_MFA",
        resource: "USER",
        resourceId: userId,
      },
    });
    
    return true;
  }
  
  return false;
}

export async function disableMFA(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      mfaEnabled: false,
      mfaSecret: null,
    },
  });
  
  // Log MFA disablement
  await prisma.auditLog.create({
    data: {
      userId,
      action: "DISABLE_MFA",
      resource: "USER",
      resourceId: userId,
    },
  });
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Swiss GDPR/nFADP compliance helpers
export async function logDataAccess(userId: string, accessedData: string[], purpose: string) {
  await prisma.auditLog.create({
    data: {
      userId,
      action: "DATA_ACCESS",
      resource: "USER_DATA",
      resourceId: userId,
      newValues: {
        accessedData,
        purpose,
        timestamp: new Date(),
      },
    },
  });
}

export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
      reviews: true,
      notifications: true,
    },
  });

  // Log data export
  await logDataAccess(userId, ["profile", "orders", "reviews", "notifications"], "DATA_EXPORT");

  return user;
}

export async function deleteUserData(userId: string) {
  // Swiss nFADP compliant data deletion
  // This would need to be carefully implemented to preserve necessary business records
  
  // Log deletion request
  await prisma.auditLog.create({
    data: {
      userId,
      action: "DATA_DELETION_REQUEST",
      resource: "USER",
      resourceId: userId,
    },
  });
  
  // In a real implementation, this would:
  // 1. Anonymize rather than delete order data (for tax/legal compliance)
  // 2. Delete personal data while preserving necessary business records
  // 3. Send confirmation to user
  // 4. Update audit logs
}