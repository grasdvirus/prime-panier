'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Collection } from '@/lib/collections';

interface CollectionCarouselProps {
    collections: Collection[];
}

export function CollectionCarousel({ collections }: CollectionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!collections || collections.length === 0) return null;

  return (
    <div className="relative max-w-7xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 py-4">
                {collections.map((collection, index) => (
                <div className="flex-[0_0_80%] sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%]" key={index}>
                     <Link href={collection.href} className="group block h-full">
                        <div className="bento-card-wrapper h-full">
                            <Card className="bento-card h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl bg-card border-border/60 relative">
                               <Image
                                    src={collection.image}
                                    alt={collection.name}
                                    width={400}
                                    height={500}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={collection.data_ai_hint}
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                <CardContent className="relative flex h-[250px] items-end justify-center p-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors text-center">{collection.name}</h3>
                                </CardContent>
                            </Card>
                        </div>
                     </Link>
                </div>
                ))}
            </div>
        </div>
         <button className="absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-background/50 rounded-full backdrop-blur-sm" onClick={scrollPrev}>
            <ArrowLeft className="h-6 w-6" />
        </button>
        <button className="absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-background/50 rounded-full backdrop-blur-sm" onClick={scrollNext}>
            <ArrowRight className="h-6 w-6" />
        </button>
    </div>
  );
}
