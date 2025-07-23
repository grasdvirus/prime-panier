import { Heart, Lock, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getInfoFeatures } from '@/lib/info-features';

const iconMap = {
    Lock: <Lock className="h-10 w-10" />,
    Heart: <Heart className="h-10 w-10" />,
    Phone: <Phone className="h-10 w-10" />,
};

export async function InfoSection() {
    const features = await getInfoFeatures();

    if (!features || features.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="text-center bg-card border-border/60 p-4">
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                    {iconMap[feature.iconName]}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{feature.description}</p>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
