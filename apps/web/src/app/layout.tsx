import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'tofi.ch - Schweizer Blumenmarktplatz',
  description: 'Frische Blumen aus der Schweiz direkt zu Ihnen nach Hause. Entdecken Sie unsere lokalen Floristen und bestellen Sie online.',
  keywords: ['Blumen', 'Schweiz', 'Florist', 'Online bestellen', 'Blumenstrauss', 'Hochzeit', 'Geburtstag'],
  authors: [{ name: 'tofi.ch' }],
  creator: 'tofi.ch',
  publisher: 'tofi.ch',
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://tofi.ch'),
  alternates: {
    canonical: '/',
    languages: {
      'de-CH': '/de',
      'fr-CH': '/fr',
      'it-CH': '/it',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de-CH">
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}