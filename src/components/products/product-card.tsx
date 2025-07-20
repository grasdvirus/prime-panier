import Link from 'next/link';
import Image from 'next/image';
import { type Product } from '@/lib/products';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl bg-card border-transparent">
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
      </Card>
    </Link>
  );
}
