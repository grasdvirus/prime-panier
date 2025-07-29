
'use client';

import React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

interface HomepageCarouselProps {
  slides: Slide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-full">
         <Carousel
            plugins={[
                Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }),
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
                        <div className="p-1">
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
                    </CarouselItem>
                ))}
            </CarouselContent>

            <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20">
                <CarouselPrevious />
            </div>
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20">
                <CarouselNext />
            </div>
        </Carousel>
    </div>
  );
}
