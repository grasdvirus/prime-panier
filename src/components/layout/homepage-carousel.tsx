'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { type Slide } from '@/lib/slides';

interface HomepageCarouselProps {
  slides: Slide[];
}

export function HomepageCarousel({ slides }: HomepageCarouselProps) {
  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide.id}>
            <Card className="border-0 rounded-lg overflow-hidden">
              <CardContent className="relative flex aspect-video items-center justify-center p-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  data-ai-hint={slide.data_ai_hint}
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
}
