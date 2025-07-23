import { Heart, Lock, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const features = [
    {
        icon: <Lock className="h-10 w-10" />,
        title: 'Sécurité garantie',
        description: 'Votre sécurité est notre priorité absolue. Nous utilisons les technologies de cryptage les plus avancées pour protéger vos informations personnelles et de paiement à chaque étape de votre parcours d\'achat.',
    },
    {
        icon: <Heart className="h-10 w-10" />,
        title: 'R.D.V avec nous',
        description: 'Votre satisfaction nous est précieuse. Nous nous engageons à vous offrir une expérience client exceptionnelle, avec des produits de qualité et un service attentif pour répondre à toutes vos attentes et envies.',
    },
    {
        icon: <Phone className="h-10 w-10" />,
        title: 'Nous contacter',
        description: (
            <>
                Une question ? N'hésitez pas à nous joindre.
                <br />
                Téléphone: 0704542909
                <br />
                Email: publixstore.exe@gmail.com
            </>
        ),
    }
];

export function InfoSection() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="text-center bg-card border-border/60 p-4">
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                    {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
