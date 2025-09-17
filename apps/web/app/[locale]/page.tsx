'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Truck, Leaf, Users, Star } from 'lucide-react';
import { Button, ProductCard } from '@tofi/ui';
import { formatCHF } from '@tofi/types';
import { trpc } from '../../lib/trpc';
import { useCartStore } from '../../stores/cart';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const t = useTranslations();
  const { addItem } = useCartStore();

  // Fetch featured products and categories
  const { data: featuredProducts, isLoading: productsLoading } = trpc.products.getFeatured.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-green-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                {t('homepage.hero_title')}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('homepage.hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/${params.locale}/products`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('navigation.products')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/${params.locale}/categories`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('navigation.categories')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/800x600/00FF00/FFFFFF?text=Swiss+Flowers"
                alt="Swiss Flowers"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-600">({params.locale === 'de' ? '2,500+ Bewertungen' : '2,500+ avis'})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('homepage.why_choose_us')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.local_producers')}</h3>
              <p className="text-gray-600">{t('homepage.local_producers_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.fresh_quality')}</h3>
              <p className="text-gray-600">{t('homepage.fresh_quality_desc')}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('homepage.sustainable')}</h3>
              <p className="text-gray-600">{t('homepage.sustainable_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('homepage.featured_products')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {params.locale === 'de' 
                ? 'Unsere beliebtesten Blumen, handverlesen von Schweizer Bauernhöfen'
                : 'Nos fleurs les plus populaires, sélectionnées à la main dans les fermes suisses'
              }
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href={`/${params.locale}/products`}>
              <Button variant="outline" size="lg">
                {params.locale === 'de' ? 'Alle Produkte anzeigen' : 'Voir tous les produits'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('homepage.categories_title')}
            </h2>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/${params.locale}/categories/${category.slug}`}
                  className="group text-center"
                >
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-3 flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                    <img
                      src={category.image || `/api/placeholder/200x200/00FF00/FFFFFF?text=${category.name.charAt(0)}`}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    {params.locale === 'fr' && category.nameFr ? category.nameFr : category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category._count.products} {params.locale === 'de' ? 'Produkte' : 'produits'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {params.locale === 'de' 
              ? 'Bereit für frische Schweizer Blumen?'
              : 'Prêt pour des fleurs suisses fraîches ?'
            }
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {params.locale === 'de' 
              ? 'Bestellen Sie noch heute und erhalten Sie kostenlosen Versand ab CHF 100.'
              : 'Commandez aujourd\'hui et bénéficiez de la livraison gratuite dès CHF 100.'
            }
          </p>
          <Link href={`/${params.locale}/products`}>
            <Button variant="secondary" size="lg">
              {params.locale === 'de' ? 'Jetzt bestellen' : 'Commander maintenant'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}