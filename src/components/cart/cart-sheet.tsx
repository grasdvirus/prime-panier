
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '../ui/badge';

export function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    getCartTotal,
    getCartItemCount,
    isCartOpen,
    setCartOpen,
  } = useCart();
  const itemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {itemCount > 0 && (
             <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                {itemCount}
             </Badge>
          )}
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Panier</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-4 py-6">
          <SheetTitle>Panier ({itemCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={item.product.data_ai_hint}
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:underline"
                        onClick={() => setCartOpen(false)}
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">
                          {item.variant.options.join(' / ')}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {(item.variant?.price ?? item.product.price).toLocaleString('fr-FR')} FCFA
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className='font-semibold'>
                        {((item.variant?.price ?? item.product.price) * item.quantity).toLocaleString('fr-FR')} FCFA
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="bg-secondary/50 p-4">
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Sous-total</span>
                  <span>{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Passer à la caisse</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Votre panier est vide</h3>
            <p className="text-muted-foreground">Les plus beaux articles vous attendent.</p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/">Continuer vos achats</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
