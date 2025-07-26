'use client';

import React, { useState } from 'react';
import Confetti from 'react-confetti';
import { useCart } from '@/contexts/cart-context';
import { OrderSummary } from '@/components/checkout/order-summary';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  const { getCartItemCount } = useCart();
  const [showConfetti, setShowConfetti] = useState(false);
  const itemCount = getCartItemCount();

  const handleOrderSuccess = () => {
    setShowConfetti(true);
  };

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

  const ManualPaymentInfo = () => (
     <Card className="bg-card/80 border-border/60">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wallet size={24}/> Paiement Manuel
            </CardTitle>
            <CardDescription>
                Pour finaliser votre commande, veuillez effectuer un transfert via l'un des services ci-dessous.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <p className='font-semibold'>Veuillez envoyer le montant total de votre commande à l'un des contacts suivants :</p>
            <div className='space-y-2 pl-4 border-l-2 border-primary'>
                <div>
                    <p className="font-bold">🔸 Orange Money :</p>
                    <p className='text-muted-foreground'>+225 07 08 22 56 82 (Nom : N'guia Achi Nadege)</p>
                </div>
                 <div>
                    <p className="font-bold">🔸 WAVE :</p>
                    <p className='text-muted-foreground'>+225 05 03 65 48 86</p>
                </div>
                 <div>
                    <p className="font-bold">🔸 WAVE :</p>
                    <p className='text-muted-foreground'>+225 07 08 22 56 82</p>
                </div>
            </div>
             <p className='text-xs text-muted-foreground pt-2'>
                Après le paiement, veuillez remplir et soumettre le formulaire avec vos informations de livraison. Nous vous contacterons pour confirmer.
            </p>
        </CardContent>
    </Card>
  );

  return (
    <>
      {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} numberOfPieces={400} />}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2 max-w-7xl mx-auto">
          <div className="order-2 lg:order-1 space-y-8">
            <ManualPaymentInfo />
            <CheckoutForm onOrderSuccess={handleOrderSuccess} />
          </div>
          <div className="order-1 lg:order-2">
            <OrderSummary />
          </div>
        </div>
      </div>
    </>
  );
}
