
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type Product, type ProductReview, type ProductVariant } from '@/lib/products';
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
import { CheckCircle, Star, ShoppingCart, ArrowLeft, MessageSquare, UserCircle, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface ProductViewProps {
  product: Product;
}

const ReviewCard = ({ review }: { review: ProductReview }) => (
  <div className="flex gap-4">
    <Avatar>
      <AvatarFallback>
        <UserCircle />
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{review.author}</p>
        <p className="text-xs text-muted-foreground">
          {review.date ? formatDistanceToNow(new Date(review.date), { addSuffix: true, locale: fr }) : ''}
        </p>
      </div>
      <div className="flex items-center gap-1 mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`}
          />
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
    </div>
  </div>
);

export function ProductView({ product }: ProductViewProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const reviews = product.reviews || [];

  const [likes, setLikes] = useState(product.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    if (likedProducts.includes(product.id)) {
      setHasLiked(true);
    }
    // Pre-select first option if available
    if (product.hasVariants && product.options.length > 0) {
        const initialSelection: Record<string, string> = {};
        product.options.forEach(option => {
            initialSelection[option.name] = option.values[0];
        });
        setSelectedOptions(initialSelection);
    }
  }, [product]);

  const handleOptionChange = useCallback((optionName: string, value: string) => {
    setSelectedOptions(prev => ({
        ...prev,
        [optionName]: value,
    }));
  }, []);

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    if (!product.hasVariants || Object.keys(selectedOptions).length < product.options.length) {
        return undefined;
    }
    const optionValues = product.options.map(opt => selectedOptions[opt.name]);
    return product.variants.find(variant => 
        variant.options.every((opt, index) => opt === optionValues[index])
    );
  }, [product, selectedOptions]);

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayStock = selectedVariant?.stock ?? product.stock;

  const handleLike = async () => {
    if (hasLiked) {
      toast({ title: "Déjà fait !", description: "Vous avez déjà aimé ce produit." });
      return;
    }
    setLikes(prev => prev + 1);
    setHasLiked(true);
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    likedProducts.push(product.id);
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    try {
      await fetch(`/api/products/${product.id}/like`, { method: 'POST' });
      toast({ title: "Merci !", description: "Votre 'J'aime' a été enregistré."});
    } catch (error) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
      const updatedLiked = JSON.parse(localStorage.getItem('likedProducts') || '[]').filter((id: number) => id !== product.id);
      localStorage.setItem('likedProducts', JSON.stringify(updatedLiked));
      toast({ title: "Erreur", description: "Impossible de sauvegarder le 'J'aime'.", variant: "destructive" });
    }
  };

  const handleAddToCart = () => {
    if (product.hasVariants) {
        if (selectedVariant) {
            addItem(product, 1, selectedVariant);
        } else {
            toast({ title: "Veuillez sélectionner une option", variant: "destructive" });
        }
    } else {
        addItem(product);
    }
  };

  const isAddToCartDisabled = product.hasVariants ? !selectedVariant || selectedVariant.stock <= 0 : product.stock <= 0;

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
            <p className="text-2xl font-semibold text-primary mt-2">{displayPrice.toLocaleString('fr-FR')} FCFA</p>
            <div className="flex items-center gap-4 text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                    ))}
                    <span>({reviews.length} avis)</span>
                </div>
                 <button onClick={handleLike} className={cn("flex items-center gap-1.5 group transition-colors", hasLiked && "text-destructive cursor-not-allowed")}>
                    <Heart className={cn("w-5 h-5 group-hover:text-destructive/80 transition-colors", hasLiked && "fill-destructive")} />
                    <span className="font-medium text-sm">{likes}</span>
                </button>
            </div>
          </div>

          {product.hasVariants && (
            <div className="space-y-4">
                {product.options.map(option => (
                    <div key={option.name}>
                        <Label className="font-semibold text-base mb-2 block">{option.name}</Label>
                        <RadioGroup
                            value={selectedOptions[option.name]}
                            onValueChange={(value) => handleOptionChange(option.name, value)}
                            className="flex flex-wrap gap-3"
                        >
                            {option.values.map(value => (
                                <RadioGroupItem key={value} value={value} id={`${option.name}-${value}`} className="sr-only" />
                            ))}
                            {option.values.map(value => (
                                <Label 
                                    key={value}
                                    htmlFor={`${option.name}-${value}`}
                                    className={cn(
                                        "border rounded-md px-4 py-2 cursor-pointer transition-colors",
                                        selectedOptions[option.name] === value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
                                    )}
                                >
                                    {value}
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </div>
          )}
          
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <div>
            <Button size="lg" variant="glass" className="w-full sm:w-auto" onClick={handleAddToCart} disabled={isAddToCartDisabled}>
              <ShoppingCart className="mr-2"/>
              {displayStock > 0 ? 'Ajouter au panier' : 'Épuisé'}
            </Button>
            <p className={cn("text-sm mt-2", displayStock > 0 ? "text-green-400" : "text-destructive")}>
              {product.hasVariants && !selectedVariant
                ? "Sélectionnez une option pour voir le stock"
                : displayStock > 0
                ? `${displayStock} en stock`
                : "Épuisé"}
            </p>
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
      <Separator className="my-12" />
        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
                <MessageSquare />
                Avis des clients ({reviews.length})
            </h2>
            {reviews.length > 0 ? (
                <div className="space-y-6">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
                </div>
            ) : (
                <p className="text-muted-foreground">Il n'y a pas encore d'avis pour ce produit.</p>
            )}
        </div>
    </div>
  );
}
