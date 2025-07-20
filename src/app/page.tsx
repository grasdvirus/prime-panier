import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12 max-w-7xl mx-auto">
        <HomepageCarousel slides={slides} />
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
