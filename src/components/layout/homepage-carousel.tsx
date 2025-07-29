
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel, { type EmblaOptionsType, type EmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface HomepageCarouselProps {
  slides: Slide[];
}

const DotButton = ({ selected, onClick }: { selected: boolean, onClick: () => void }) => (
  <button
    className={cn(
      "h-2 rounded-full bg-muted transition-all duration-300 hover:bg-muted-foreground/50",
      selected ? "bg-primary w-8" : "w-2"
    )}
    type="button"
    onClick={onClick}
    aria-label="Go to slide"
  />
);

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' }, 
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      emblaApi.plugins().autoplay?.reset();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      emblaApi.plugins().autoplay?.reset();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      emblaApi.plugins().autoplay?.reset();
    }
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);


  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div 
                className={cn(
                    "flex-[0_0_90%] md:flex-[0_0_80%] p-2 transition-all duration-500",
                    index === selectedIndex ? "" : "blur-sm scale-95"
                )} 
                key={index}
            >
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
