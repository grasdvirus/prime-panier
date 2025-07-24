'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
            </Button>
        </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="w-full">
          <Carousel className="rounded-lg overflow-hidden">
            <CarouselContent>
              {product.images.map((src, index) => (
                <CarouselItem key={index}>
                  <Card className="border-0 rounded-none">
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <Image
                        src={src}
                        alt={`${product.name} - image ${index + 1}`}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                        data-ai-hint={product.data_ai_hint}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Link href={`/collections/${product.category}`} passHref>
                <Badge variant="secondary" className="mb-2 hover:bg-primary/20 transition-colors cursor-pointer">{product.category}</Badge>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">{product.price.toLocaleString('fr-FR')} FCFA</p>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                    ))}
                </div>
                <span>({product.reviews} avis)</span>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <div>
            <Button size="lg" variant="glass" className="w-full sm:w-auto" onClick={handleAddToCart} disabled={product.stock <= 0}>
              <ShoppingCart className="mr-2"/>
              {product.stock > 0 ? 'Ajouter au panier' : 'Épuisé'}
            </Button>
            <p className={product.stock > 0 ? "text-sm text-green-400 mt-2" : "text-sm text-destructive mt-2"}>{product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-lg mb-3">Caractéristiques</h3>
            <ul className="space-y-2 text-muted-foreground">
                {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
