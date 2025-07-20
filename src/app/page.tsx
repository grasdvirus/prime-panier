import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';
import { Carousel, CarouselContent } from '@/components/ui/carousel';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();

  return (
    <div className="w-full">
      <section className="mb-12">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            <HomepageCarousel slides={slides} />
          </CarouselContent>
        </Carousel>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
