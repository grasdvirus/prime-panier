
'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface HomepageCarouselProps {
  slides: Slide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' }, 
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);


  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div className="flex-[0_0_100%] p-2" key={index}>
              <Card className="border-0 rounded-2xl overflow-hidden">
                <CardContent className="relative flex aspect-[16/10] md:aspect-[21/9] items-center justify-center p-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    data-ai-hint={slide.data_ai_hint}
                    priority={index === 0}
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
            </div>
          ))}
        </div>
      </div>
       <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20">
          <Button variant="glass" size="icon" onClick={scrollPrev}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
      </div>
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20">
          <Button variant="glass" size="icon" onClick={scrollNext}>
            <ArrowRight className="h-5 w-5" />
          </Button>
      </div>
    </div>
  );
}
