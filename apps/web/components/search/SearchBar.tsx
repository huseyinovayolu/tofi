'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { Button, LoadingSpinner } from '@tofi/ui';
import { formatCHF } from '@tofi/types';
import { trpc } from '../../lib/trpc';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function SearchBar({ isOpen, onClose, locale }: SearchBarProps) {
  const t = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults, isLoading } = trpc.products.search.useQuery(
    { query: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length > 2 }
  );

  const handleProductClick = (productId: string) => {
    router.push(`/${locale}/products/${productId}`);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div className="max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.search_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg outline-none placeholder-gray-400"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {searchResults && searchResults.length > 0 && (
            <div className="p-2">
              {searchResults.map((product) => {
                const images = JSON.parse(product.images as string) as string[];
                const imageUrl = images[0] || '/api/placeholder/flower-default.jpg';
                
                return (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                  >
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.farmer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCHF(product.price)}</p>
                      <p className="text-xs text-gray-500">{product.category.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {debouncedQuery.length > 2 && searchResults && searchResults.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>{t('products.no_results')}</p>
            </div>
          )}

          {query.trim() && (
            <div className="p-3 border-t bg-gray-50">
              <button
                onClick={handleSearchSubmit}
                className="w-full text-left text-sm text-green-600 hover:text-green-700"
              >
                {locale === 'de' 
                  ? `Alle Ergebnisse für "${query}" anzeigen`
                  : `Voir tous les résultats pour "${query}"`
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}