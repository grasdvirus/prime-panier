
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqItems = [
    {
        question: "Quels sont les délais de livraison ?",
        answer: "Les délais de livraison sont généralement de 24 à 72 heures pour Abidjan et ses environs. Pour les livraisons à l'intérieur du pays, cela peut prendre jusqu'à 5 jours ouvrables."
    },
    {
        question: "Quelles sont les options de paiement ?",
        answer: "Nous acceptons les paiements via Orange Money et Wave. Les instructions de paiement vous sont présentées lors de la finalisation de votre commande. Votre commande est confirmée après réception du paiement."
    },
    {
        question: "Comment puis-je suivre ma commande ?",
        answer: "Une fois votre commande confirmée et expédiée, vous recevrez une notification par téléphone. Pour toute question sur le statut de votre commande, vous pouvez nous contacter directement via les informations affichées sur cette page."
    },
    {
        question: "Proposez-vous les retours ou échanges ?",
        answer: "Oui, nous acceptons les échanges sous 7 jours pour les articles non portés et dans leur emballage d'origine. Veuillez nous contacter pour initier le processus d'échange. Nous ne proposons pas de remboursement, mais un avoir peut être émis."
    }
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Une erreur s'est produite lors de l'envoi du message.");
      }

      toast({
        title: 'Message envoyé !',
        description: 'Merci pour votre message. Nous vous répondrons bientôt.',
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 py-12">
        <div className="text-center mb-12">
             <h1 className="text-4xl font-bold tracking-tighter">Entrons en contact</h1>
             <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Que vous ayez une question, une suggestion ou simplement envie de dire bonjour, nous sommes là pour vous. Remplissez le formulaire ou utilisez nos coordonnées directes.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side: Form & FAQ */}
            <div className="space-y-12">
                <form onSubmit={handleSubmit}>
                    <Card className="bento-card">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Laissez-nous un message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input id="name" type="text" placeholder="Votre nom" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading}/>
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Votre email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Votre message..." required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} disabled={loading}/>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                Envoyer le message
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
                
                <div>
                    <h2 className="text-2xl font-bold mb-4">Questions Fréquentes</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            {/* Right side: Contact Info */}
            <div className="space-y-6">
                <Card className="bento-card">
                    <CardHeader>
                        <CardTitle>Contact Direct</CardTitle>
                        <CardDescription>Pour une réponse plus rapide, n'hésitez pas à nous joindre directement.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Phone className="w-6 h-6 text-primary" />
                            <div>
                                <h4 className="font-semibold">Téléphone</h4>
                                <a href="tel:+2250708225682" className="text-muted-foreground hover:text-primary transition-colors">+225 07 08 22 56 82</a>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6 text-primary" />
                            <div>
                                <h4 className="font-semibold">Email</h4>
                                <a href="mailto:contact@primepanier.com" className="text-muted-foreground hover:text-primary transition-colors">contact@primepanier.com</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-primary mt-1" />
                            <div>
                                <h4 className="font-semibold">Localisation</h4>
                                <p className="text-muted-foreground">Abidjan, Côte d'Ivoire</p>
                                <p className="text-xs text-muted-foreground/80">Nous sommes une boutique 100% en ligne, mais nos opérations sont basées à Abidjan.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
