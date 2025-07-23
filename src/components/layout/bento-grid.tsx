import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const BentoItem = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('bento-card-wrapper', className)}>
      <Card className="bento-card h-full w-full" {...props}>
        {children}
      </Card>
    </div>
  );
};

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      <BentoItem className="md:col-span-2 lg:col-span-2 row-span-2">
        <CardContent className="relative flex flex-col justify-between h-full p-6">
          <Image
            src="https://placehold.co/800x800.png"
            alt="Sound Systems"
            fill
            className="object-cover rounded-lg -z-10"
            data-ai-hint="audio device"
          />
          <div className="bg-black/20 absolute inset-0 rounded-lg -z-10" />
          <div>
            <p className="text-sm font-medium text-foreground/80">
              Systèmes Audio
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-white mt-1">
              Un son incroyable. À votre commande.
            </h3>
          </div>
          <Link href="#" className="flex items-center gap-2 text-white font-semibold hover:underline mt-4">
            En savoir plus <ArrowRight size={16} />
          </Link>
        </CardContent>
      </BentoItem>

      <BentoItem className="lg:col-span-2">
        <CardContent className="relative flex flex-col justify-between h-full p-6">
          <Image
            src="https://placehold.co/800x400.png"
            alt="Security Cameras"
            fill
            className="object-cover rounded-lg -z-10"
            data-ai-hint="security camera"
          />
          <div className="bg-black/20 absolute inset-0 rounded-lg -z-10" />
           <div>
            <p className="text-sm font-medium text-foreground/80">
              Caméras de sécurité
            </p>
            <h3 className="text-2xl font-bold tracking-tight text-white mt-1">
              Voyez ce qui se passe à la maison.
            </h3>
          </div>
          <Link href="#" className="flex items-center gap-2 text-white font-semibold hover:underline mt-4">
            Explorer <ArrowRight size={16} />
          </Link>
        </CardContent>
      </BentoItem>

       <BentoItem>
         <CardContent className="relative flex flex-col justify-between h-full p-6 bg-gradient-to-br from-blue-400 to-indigo-600">
            <h3 className="text-xl font-bold tracking-tight text-white">
                Gérez à distance tous vos appareils connectés.
            </h3>
         </CardContent>
       </BentoItem>

       <BentoItem>
       <CardContent className="relative flex flex-col justify-between h-full p-6">
          <Image
            src="https://placehold.co/400x400.png"
            alt="Smartwatches"
            fill
            className="object-cover rounded-lg -z-10"
            data-ai-hint="smartwatch person"
          />
          <div className="bg-black/40 absolute inset-0 rounded-lg -z-10" />
           <div>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1">
              Smartwatches Hybrides
            </h3>
          </div>
          <Link href="#" className="flex items-center gap-2 text-white font-semibold hover:underline mt-4">
            Explorer <ArrowRight size={16} />
          </Link>
        </CardContent>
       </BentoItem>
    </div>
  );
}
