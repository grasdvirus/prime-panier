
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

interface HomepageCarouselProps {
  slides: Slide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    if (emblaApi) {
      setScrollSnaps(emblaApi.scrollSnapList());
    }
  }, []);
  
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);

  }, [emblaApi, onInit, onSelect]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative">
         <Carousel
            setApi={setEmblaApi}
            plugins={[
                Autoplay({ delay: 5000, stopOnInteraction: false }),
                Fade()
            ]}
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-0 embla-fade">
                {slides.map((slide, index) => (
                    <CarouselItem key={index} className="pl-0 embla-fade__slide">
                        <Card className="border-0 rounded-2xl overflow-hidden mx-2 md:mx-4">
                          <CardContent className="relative flex aspect-[16/10] md:aspect-[21/9] items-center justify-center p-0">
                            <Image
                              src={slide.imageUrl}
                              alt={slide.title}
                              fill
                              className="object-cover"
                              data-ai-hint={slide.data_ai_hint}
                              priority={slide.id === 1}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="relative text-center text-white p-4 z-10">
                              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 font-headline">
                                {slide.title}
                              </h2>
                              <p className="text-md md:text-lg max-w-2xl mx-auto">
                                {slide.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20">
                <CarouselPrevious />
            </div>
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20">
                <CarouselNext />
            </div>
          
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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
        </Carousel>
    </div>
  );
}
    
