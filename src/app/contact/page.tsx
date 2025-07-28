'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Une erreur s'est produite lors de l'envoi du message.");
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
    <div className="w-full flex min-h-[80vh] items-center justify-center p-4">
      <div className="bento-card-wrapper max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
         <Card className="bento-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tighter">Contactez-nous</CardTitle>
            <CardDescription className="text-muted-foreground">
              Une question, un avis ? N'hésitez pas à nous laisser un message.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Votre email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Votre message..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  disabled={loading}
                />
              </div>
          </CardContent>
          <CardFooter>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Envoyer le message
              </Button>
          </CardFooter>
        </Card>
        </form>
      </div>
    </div>
  );
}
