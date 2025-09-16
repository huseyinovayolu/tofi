import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export function generateStaticParams() {
  return [
    { locale: 'de-CH' },
    { locale: 'fr-CH' },
    { locale: 'it-CH' },
    { locale: 'en' },
  ];
}

export const metadata = {
  title: 'tofi.ch - Schweizer Blumenmarktplatz',
  description: 'Der führende Marktplatz für frische Blumen in der Schweiz. Direkt von lokalen Produzenten.',
  keywords: 'Blumen, Schweiz, Marktplatz, frisch, lokal, Zürich, Bern, Basel',
  openGraph: {
    title: 'tofi.ch - Schweizer Blumenmarktplatz',
    description: 'Der führende Marktplatz für frische Blumen in der Schweiz.',
    url: 'https://tofi.ch',
    siteName: 'tofi.ch',
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tofi.ch - Schweizer Blumenmarktplatz',
    description: 'Der führende Marktplatz für frische Blumen in der Schweiz.',
  },
};

export default async function RootLayout({
  children,
  params: { locale }
}: Props) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}