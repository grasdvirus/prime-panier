
import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';
import { BentoGrid } from '@/components/layout/bento-grid';
import { CollectionCarousel } from '@/components/products/collection-carousel';
import { InfoSection } from '@/components/layout/info-section';
import { getCollections } from '@/lib/collections';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();
  const collections = await getCollections();

  return (
    <div className="w-full space-y-12 md:space-y-16 lg:space-y-24">
      <section className="w-full -mt-2">
        <HomepageCarousel slides={slides} />
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <BentoGrid />
      </section>

      <div className="px-4 sm:px-6 lg:px-8">
        <ProductGrid products={products} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Parcourir par collection</h2>
         <CollectionCarousel collections={collections} />
      </div>

      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <InfoSection />
      </section>
    </div>
  );
}
    