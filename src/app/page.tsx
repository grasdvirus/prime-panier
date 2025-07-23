import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import { BentoGrid } from '@/components/layout/bento-grid';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();

  return (
    <div className="w-full space-y-2">
      <section>
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

      <section className="px-4 sm:px-6 lg:px-8 py-2">
        <BentoGrid />
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Nouveaux Produits</h2>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
