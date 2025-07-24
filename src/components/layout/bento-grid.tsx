'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { ArrowRight } from 'lucide-react';
import { getBentoClient, type Bento } from '@/lib/bento-client';

const BentoItem = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('bento-card-wrapper h-full', className)}>
      <Card className="bento-card h-full w-full" {...props}>
        {children}
      </Card>
    </div>
  );
};

const BentoCardContent = ({ item }: { item: Bento }) => {
  const hasImage = !!item.imageUrl;

  return (
    <CardContent className={cn("relative flex flex-col justify-between h-full p-6", !hasImage && "bg-gradient-to-br from-blue-400 to-indigo-600")}>
      {hasImage && (
        <>
            <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover rounded-lg"
                data-ai-hint={item.data_ai_hint}
            />
            <div className="bg-black/30 absolute inset-0 rounded-lg" />
        </>
      )}
      <div className='z-10'>
        <p className="text-sm font-medium text-foreground/80">
          {item.title}
        </p>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
          {item.subtitle}
        </h3>
      </div>
      <Link href={item.href} className="z-10 flex items-center gap-2 text-white font-semibold hover:underline mt-4">
        Explorer <ArrowRight size={16} />
      </Link>
    </CardContent>
  );
};


export function BentoGrid() {
    const [bentoItems, setBentoItems] = React.useState<Bento[]>([]);

    React.useEffect(() => {
        const fetchBento = async () => {
            const items = await getBentoClient();
            setBentoItems(items);
        };
        fetchBento();
    }, []);

    if (!bentoItems.length) return null;

  return (
    <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Nos Offres</h2>
        
        {/* Desktop Grid: Restores the original bento grid layout */}
        <div className="hidden md:grid md:auto-rows-[250px] md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {bentoItems.map((item) => (
                <BentoItem key={item.id} className={cn(item.className)}>
                   <BentoCardContent item={item} />
                </BentoItem>
            ))}
        </div>

        {/* Mobile Vertical Scroll Container */}
        <div className="md:hidden max-h-[400px] overflow-y-auto space-y-4 pr-2">
            {bentoItems.map((item) => (
                <div key={item.id} className={'h-[250px]'}>
                    <BentoItem>
                        <BentoCardContent item={item} />
                    </BentoItem>
                </div>
            ))}
        </div>
    </div>
  );
}
