'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/cart-context';
import { createOrderClient, type OrderRequest } from '@/lib/orders-client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis.' }),
  phone: z.string().min(1, { message: 'Le numéro de téléphone est requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }).optional().or(z.literal('')),
  address: z.string().min(1, { message: "L'adresse de livraison est requise." }),
  notes: z.string().optional(),
});

interface CheckoutFormProps {
    onOrderSuccess: () => void;
}

export function CheckoutForm({ onOrderSuccess }: CheckoutFormProps) {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const orderRequest: OrderRequest = {
            id: new Date().getTime(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            customer: values,
            items: items.map(item => ({
                id: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
            })),
        };

        await createOrderClient(orderRequest);

        onOrderSuccess(); 

        toast({
            title: "Commande envoyée !",
            description: "Nous avons bien reçu votre commande et nous vous contacterons bientôt pour la confirmation.",
        });
        
        clearCart();
        
        setTimeout(() => {
          router.push('/');
        }, 5000); 

    } catch (error) {
        toast({
            title: "Erreur",
            description: "Une erreur s'est produite lors de l'envoi de votre commande.",
            variant: "destructive"
        })
        console.error(error);
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Vos informations</h2>
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nom complet</FormLabel><FormControl><Input placeholder="Prénom et Nom" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Numéro de téléphone</FormLabel><FormControl><Input placeholder="Pour la confirmation de la commande" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email (Optionnel)</FormLabel><FormControl><Input placeholder="Pour recevoir les mises à jour par email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Adresse de livraison complète</FormLabel><FormControl><Textarea placeholder="Ex: Ville, Commune, Quartier, Rue, Bâtiment, Porte..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Notes de commande (Optionnel)</FormLabel><FormControl><Textarea placeholder="Instructions spéciales pour la livraison, etc." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <Separator />

        <Button type="submit" size="lg" className="w-full" disabled={isLoading || items.length === 0}>
            {isLoading ? <Loader2 className='animate-spin mr-2' /> : <Send className='mr-2' />}
            Confirmer et envoyer ma commande
        </Button>
      </form>
    </Form>
  );
}
