'use client';

import { useCart } from '@/contexts/cart-context';
import { OrderSummary } from '@/components/checkout/order-summary';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  if (itemCount === 0) {
    return (
      <div className="w-full flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">Vous ne pouvez pas passer à la caisse avec un panier vide.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retourner à la boutique
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2 max-w-7xl mx-auto">
        <div className="order-2 lg:order-1">
          <CheckoutForm />
        </div>
        <div className="order-1 lg:order-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
