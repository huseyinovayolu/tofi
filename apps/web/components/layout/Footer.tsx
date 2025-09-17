'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">Tofi</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {locale === 'de' 
                ? 'Schweizer Blumen direkt vom Bauernhof. Frisch, regional und nachhaltig für Ihre besonderen Momente.'
                : 'Fleurs suisses directement de la ferme. Fraîches, régionales et durables pour vos moments spéciaux.'
              }
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Zürich, Schweiz</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">+41 44 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">info@tofi.ch</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">
              {locale === 'de' ? 'Schnelllinks' : 'Liens rapides'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/products`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('navigation.categories')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">
              {locale === 'de' ? 'Kundenservice' : 'Service client'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/help`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {locale === 'de' ? 'Hilfe' : 'Aide'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {locale === 'de' ? 'Versand' : 'Livraison'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/returns`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {locale === 'de' ? 'Rückgabe' : 'Retours'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-green-400 transition-colors">
                  {locale === 'de' ? 'Datenschutz' : 'Confidentialité'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          
          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>&copy; 2024 Tofi. {locale === 'de' ? 'Alle Rechte vorbehalten.' : 'Tous droits réservés.'}</p>
            <p className="mt-1">
              {locale === 'de' ? 'Schweizer Blumen für Schweizer Herzen' : 'Fleurs suisses pour les cœurs suisses'} 🇨🇭
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}