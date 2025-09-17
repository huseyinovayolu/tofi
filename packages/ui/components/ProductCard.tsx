import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product, formatCHF } from '@tofi/types';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product & { category: { name: string } };
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  className
}: ProductCardProps) {
  const images = JSON.parse(product.images as string) as string[];
  const imageUrl = images[0] || '/api/placeholder/flower-default.jpg';

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-md', className)}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>
        )}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
          {product.stock < 10 && (
            <Badge variant="destructive" className="text-xs">
              Nur noch {product.stock} verfügbar
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">
            {product.farmer}
          </p>
        </div>
        
        <p className="mb-3 text-sm text-gray-700 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {formatCHF(product.price)}
          </span>
          <Badge variant="outline" className="text-xs">
            {product.region}
          </Badge>
        </div>
        
        <Button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? 'Ausverkauft' : 'In den Warenkorb'}
        </Button>
      </div>
    </Card>
  );
}