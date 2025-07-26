
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';
import { cn } from '@/lib/utils';
import { CarouselNext, CarouselPrevious } from '../ui/carousel';

interface HomepageCarouselProps {
  slides: Slide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);
  
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);

    const interval = setInterval(() => {
        emblaApi?.scrollNext();
    }, 5000);

    return () => clearInterval(interval);

  }, [emblaApi, onInit, onSelect]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div className="relative flex-[0_0_100%]" key={slide.id}>
                <Card className="border-0 rounded-none overflow-hidden">
                  <CardContent className="relative flex aspect-[16/10] md:aspect-video items-center justify-center p-0">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      data-ai-hint={slide.data_ai_hint}
                      priority={slide.id === 1}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative text-center text-white p-4">
                      <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 font-headline">
                        {slide.title}
                      </h2>
                      <p className="text-md md:text-lg max-w-2xl mx-auto">
                        {slide.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
            </div>
          ))}
        </div>
      </div>

      <CarouselPrevious className="left-2 sm:left-4" />
      <CarouselNext className="right-2 sm:right-4" />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300 backdrop-blur-sm',
              selectedIndex === index ? 'w-6 bg-primary' : 'bg-white/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
