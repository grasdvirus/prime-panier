'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';
import { cn } from '@/lib/utils';

interface HomepageCarouselProps {
  slides: Slide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="embla-fade" ref={emblaRef}>
        <div className="embla-fade__container">
          {slides.map((slide) => (
            <div className="embla-fade__slide" key={slide.id}>
              <Card className="border-0 rounded-lg overflow-hidden">
                <CardContent className="relative flex aspect-video items-center justify-center p-0">
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              selectedIndex === index ? 'w-6 bg-primary' : 'bg-white/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
