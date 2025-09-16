import { useTranslations } from 'next-intl';
import { Button } from '@tofi/ui';

export default function HomePage() {
  const t = useTranslations('homepage');

  return (
    <main className="min-h-screen bg-gradient-to-br from-swiss-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="swiss-text-gradient">tofi.ch</span>
            </h1>
            <p className="text-xl md:text-2xl text-swiss-gray-600 mb-8 max-w-3xl mx-auto hyphens-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="swiss" size="lg">
                {t('hero.cta.browse')}
              </Button>
              <Button variant="swissOutline" size="lg">
                {t('hero.cta.merchant')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-swiss-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-swiss-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-swiss-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="swiss-card text-center">
              <div className="w-16 h-16 bg-swiss-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-swiss-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.fresh.title')}</h3>
              <p className="text-swiss-gray-600">{t('features.fresh.description')}</p>
            </div>
            
            <div className="swiss-card text-center">
              <div className="w-16 h-16 bg-swiss-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-swiss-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.local.title')}</h3>
              <p className="text-swiss-gray-600">{t('features.local.description')}</p>
            </div>
            
            <div className="swiss-card text-center">
              <div className="w-16 h-16 bg-swiss-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-swiss-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.payment.title')}</h3>
              <p className="text-swiss-gray-600">{t('features.payment.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-swiss-red-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-swiss-red-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <Button variant="secondary" size="lg">
            {t('cta.button')}
          </Button>
        </div>
      </section>
    </main>
  );
}