'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@tofi/ui';
import { formatCHF } from '@tofi/types';
import { useCartStore } from '../../stores/cart';
import { trpc } from '../../lib/trpc';

interface CartDrawerProps {
  locale: string;
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const t = useTranslations();
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getMWST, 
    getShippingCost, 
    getTotal 
  } = useCartStore();

  // Get product details for cart items
  const productIds = items.map(item => item.productId);
  const { data: products } = trpc.products.getAll.useQuery(
    { limit: 100 },
    { enabled: productIds.length > 0 }
  );

  const cartItemsWithProducts = items.map(item => {
    const product = products?.products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = getSubtotal();
  const mwst = getMWST();
  const shippingCost = getShippingCost();
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{t('cart.title')}</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItemsWithProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('cart.empty')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {locale === 'de' 
                    ? 'Fügen Sie Produkte hinzu, um loszulegen.'
                    : 'Ajoutez des produits pour commencer.'
                  }
                </p>
                <Button onClick={() => setIsOpen(false)}>
                  {t('cart.continue_shopping')}
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItemsWithProducts.map((item) => {
                  if (!item.product) return null;
                  
                  const images = JSON.parse(item.product.images as string) as string[];
                  const imageUrl = images[0] || '/api/placeholder/flower-default.jpg';
                  
                  return (
                    <div key={item.productId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">{item.product.farmer}</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCHF(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItemsWithProducts.length > 0 && (
            <div className="border-t bg-white p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('common.subtotal')}:</span>
                  <span>{formatCHF(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('common.vat')}:</span>
                  <span>{formatCHF(mwst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('common.shipping')}:</span>
                  <span>{shippingCost === 0 ? t('common.free_shipping') : formatCHF(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>{t('common.total')}:</span>
                  <span>{formatCHF(total)}</span>
                </div>
              </div>
              
              <Link href={`/${locale}/checkout`} onClick={() => setIsOpen(false)}>
                <Button className="w-full" size="lg">
                  {t('cart.proceed_to_checkout')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}