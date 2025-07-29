
'use client';

import { useCart } from '@/contexts/cart-context';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function OrderSummary() {
  const { items, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5000 : 0; // Assuming shipping is 5000 FCFA
  const total = subtotal + shipping;

  return (
    <div className="rounded-lg border border-border/60 bg-card p-6 lg:p-8 sticky top-28">
      <h2 className="text-2xl font-semibold mb-6">Résumé de la commande</h2>
      <ScrollArea className="h-full max-h-96">
        <div className="space-y-4 pr-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={item.product.data_ai_hint}
                />
                 <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {item.quantity}
                 </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">{item.variant.options.join(' / ')}</p>
                )}
                <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
              </div>
              <p className="font-medium">
                {((item.variant?.price ?? item.product.price) * item.quantity).toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <Separator className="my-6" />

      <div className="space-y-2">
        <div className="flex justify-between text-muted-foreground">
          <span>Sous-total</span>
          <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Livraison</span>
          <span>{shipping.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>
      
      <Separator className="my-6" />

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>{total.toLocaleString('fr-FR')} FCFA</span>
      </div>
    </div>
  );
}
