import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12 max-w-7xl mx-auto">
         <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
             <HomepageCarousel slides={slides} />
          </CarouselContent>
        </Carousel>
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
