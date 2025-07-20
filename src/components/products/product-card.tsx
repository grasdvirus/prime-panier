'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type Product } from '@/lib/products';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl bg-card border-border/60 relative">
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.data_ai_hint}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-base font-medium group-hover:text-primary transition-colors truncate">{product.name}</h3>
          <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
        </CardContent>
        <Button 
          size="icon" 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleAddToCart}
          aria-label="Ajouter au panier"
        >
          <Plus />
        </Button>
      </Card>
    </Link>
  );
}
