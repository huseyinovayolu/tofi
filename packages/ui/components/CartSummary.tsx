import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem, formatCHF, calculateMWST } from '@tofi/types';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface CartSummaryProps {
  items: (CartItem & { product: { name: string; images: string } })[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  className?: string;
}

export function CartSummary({
  items,
  onUpdateQuantity,
  onRemoveItem,
  className
}: CartSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const mwst = calculateMWST(subtotal);
  const total = subtotal + mwst;

  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Ihr Warenkorb ist leer</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Warenkorb ({items.length} Artikel)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const images = JSON.parse(item.product.images) as string[];
            const imageUrl = images[0] || '/api/placeholder/flower-default.jpg';
            
            return (
              <div key={item.productId} className="flex items-center space-x-4 py-2">
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">{formatCHF(item.price)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Zwischensumme:</span>
              <span>{formatCHF(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>MWST (7.7%):</span>
              <span>{formatCHF(mwst)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatCHF(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}