
import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';
import { BentoGrid } from '@/components/layout/bento-grid';
import { CollectionCarousel } from '@/components/products/collection-carousel';
import { InfoSection } from '@/components/layout/info-section';
import { getCollections } from '@/lib/collections';
import { Marquee } from '@/components/layout/marquee';
import { getSiteSettings } from '@/lib/settings';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();
  const collections = await getCollections();
  const settings = await getSiteSettings();

  return (
    <div className="w-full space-y-8">
      <section className="space-y-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <Marquee />
        </div>
        <div className="w-full">
          <HomepageCarousel slides={slides} />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pt-12">
        <BentoGrid />
      </section>

      <div className="px-4 sm:px-6 lg:px-8 pt-12">
        <ProductGrid 
            products={products} 
            title="Nouveaux Produits" 
            paginated 
            productsPerPage={settings.productsPerPage}
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-24">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Parcourir par collection</h2>
         <CollectionCarousel collections={collections} />
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <InfoSection />
      </section>
    </div>
  );
}
