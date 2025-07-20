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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide.' }),
  shipping: z.object({
    firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
    lastName: z.string().min(1, { message: 'Le nom est requis.' }),
    address: z.string().min(1, { message: "L'adresse est requise." }),
    city: z.string().min(1, { message: 'La ville est requise.' }),
    postalCode: z.string().min(1, { message: 'Le code postal est requis.' }),
    country: z.string().min(1, { message: 'Le pays est requis.' }),
  }),
  paymentMethod: z.enum(['card', 'paypal', 'paystack'], {
    required_error: 'Vous devez sélectionner une méthode de paiement.',
  }),
});

const PaystackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
        <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM17.16 14.28C16.596 14.844 15.864 15.24 15 15.42L14.712 16.5H12.924L13.2 15.384C12.432 15.228 11.724 14.832 11.16 14.28C10.596 13.716 10.2 12.984 10.02 12.12H15.084C15.264 12.984 14.904 13.716 14.34 14.28C13.788 14.832 13.068 15.084 12.228 15.084C11.388 15.084 10.668 14.832 10.116 14.28C9.564 13.728 9.288 13.02 9.288 12.228C9.288 11.436 9.564 10.74 10.116 10.188C10.668 9.636 11.388 9.36 12.228 9.36C13.068 9.36 13.788 9.612 14.34 10.164C14.904 10.716 15.288 11.424 15.432 12.264H17.22C17.028 10.5 16.14 9.192 14.736 8.352C14.1 7.944 13.38 7.68 12.576 7.584L12.864 6.516H11.076L10.8 7.584C9.576 7.824 8.58 8.496 7.812 9.6C6.912 10.884 6.912 12.42 7.812 13.704C8.712 14.988 10.116 15.876 11.7 16.164L11.412 17.232H13.2L13.488 16.164C14.256 16.32 15 16.5 15.6 16.5C16.092 16.5 16.56 16.392 16.98 16.188L17.16 14.28Z" fill="currentColor"/>
    </svg>
);

const PayPalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
        <path d="M4.34921 7.37682C4.19171 7.82882 4.02721 8.43282 3.94521 8.84282C5.01321 8.46882 6.08821 8.33782 7.02921 8.52082C7.54521 8.62282 7.95721 8.80382 8.27721 9.06282C8.42821 9.18682 8.55221 9.34982 8.64021 9.53182C8.71121 9.68282 8.76121 9.85182 8.79121 10.0248C8.90521 10.6698 8.69721 11.2828 8.23821 11.6968C7.68021 12.1958 6.90821 12.3808 6.13821 12.2038L5.70821 13.5658C5.65421 13.7438 5.60121 13.9218 5.54921 14.0998L5.34021 14.7728C5.24121 15.1058 5.37821 15.4618 5.66921 15.6338C5.96021 15.8058 6.32521 15.7678 6.55021 15.5408L6.68521 15.3978C7.59521 14.4108 8.94021 13.8868 10.3602 13.8868H11.2332C15.2932 13.8868 18.5772 11.2188 19.1082 7.34882C19.1762 6.87882 19.2272 6.41182 19.2602 5.94982H14.1552C13.8342 5.94982 13.5702 6.21382 13.5702 6.53482C13.5702 6.85582 13.8342 7.11982 14.1552 7.11982H17.8442C17.4722 9.56982 15.3532 11.4588 12.8132 11.7248C12.4202 11.7698 12.0222 11.7918 11.6212 11.7918H10.3602C9.46221 11.7918 8.66521 11.4588 8.12721 10.7718C7.89321 10.4578 7.76521 10.0528 7.79521 9.64282C7.84021 9.02982 8.24521 8.52782 8.78321 8.23882C9.43021 7.88982 10.2792 7.82882 11.1212 8.04682L11.5162 6.80982C11.5832 6.61182 11.6442 6.42082 11.6982 6.23682L12.0522 5.03582C12.1472 4.71782 11.9612 4.38282 11.6312 4.28082C11.3012 4.17882 10.9502 4.35482 10.8252 4.67382L9.41221 8.52082C9.09221 9.28382 8.44521 9.85182 7.64821 10.0858C6.67121 10.3748 5.62621 10.2318 4.86821 9.54882C4.54521 9.27482 4.34921 8.87982 4.34921 8.46182V7.37682Z" fill="currentColor"/>
    </svg>
);

const StripeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
        <path d="M14.28.375v3.98H4.246c-1.01 0-1.907.57-2.35 1.456-.44.88-.344 1.93.24 2.704l7.98 10.323h6.16c1.01 0 1.907-.57 2.35-1.457.44-.88.343-1.93-.24-2.704L10.402.375h3.878z" fill="#fff" fillOpacity=".6"/>
        <path d="M21.754 9.497c-.585-.774-1.55-1.12-2.4-.95l-7.98 1.584v4.04h10.034c1.01 0 1.907-.57 2.35-1.457.44-.88.344-1.93-.24-2.704l-1.764-.513z" fill="#fff"/>
    </svg>
);

export function CheckoutForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      shipping: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France',
      },
      paymentMethod: 'card',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="votre@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
            <h2 className="text-2xl font-semibold mb-4">Adresse de livraison</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="shipping.firstName" render={({ field }) => (
                        <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="shipping.lastName" render={({ field }) => (
                        <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="shipping.address" render={({ field }) => (
                    <FormItem><FormLabel>Adresse</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField control={form.control} name="shipping.city" render={({ field }) => (
                        <FormItem><FormLabel>Ville</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="shipping.postalCode" render={({ field }) => (
                        <FormItem><FormLabel>Code Postal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="shipping.country" render={({ field }) => (
                        <FormItem><FormLabel>Pays</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>
        </div>

        <Separator />

        <div>
            <h2 className="text-2xl font-semibold mb-4">Paiement</h2>
            <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col gap-4"
                            >
                                <Label htmlFor="card" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                    <RadioGroupItem value="card" id="card" />
                                    <StripeIcon />
                                    <span className="flex-1 font-medium">Carte de crédit</span>
                                </Label>
                                <Label htmlFor="paypal" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <PayPalIcon />
                                    <span className="flex-1 font-medium">PayPal</span>
                                </Label>
                                 <Label htmlFor="paystack" className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors">
                                    <RadioGroupItem value="paystack" id="paystack" />
                                    <PaystackIcon />
                                    <span className="flex-1 font-medium">Paystack</span>
                                </Label>
                            </RadioGroup>
                        </FormControl>
                         <FormMessage className='pt-4' />
                    </FormItem>
                )}
            />
        </div>

        <Button type="submit" size="lg" className="w-full">Payer maintenant</Button>
      </form>
    </Form>
  );
}
