'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useMessages } from 'next-intl';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { trpc } from '../../lib/trpc';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

function LocaleLayoutInner({ children, params }: LocaleLayoutProps) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header locale={params.locale} />
        <main className="flex-1">
          {children}
        </main>
        <Footer locale={params.locale} />
      </div>
    </NextIntlClientProvider>
  );
}

export default trpc.withTRPC(LocaleLayoutInner);