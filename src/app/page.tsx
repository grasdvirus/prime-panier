import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';
import { HomepageCarousel } from '@/components/layout/homepage-carousel';
import { getSlides } from '@/lib/slides';

export default async function Home() {
  const products = await getProducts();
  const slides = await getSlides();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <HomepageCarousel slides={slides} />
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
