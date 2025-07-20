import { ProductGrid } from '@/components/products/product-grid';
import { getProducts } from '@/lib/products';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
          Noir Élégant
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez notre collection exclusive d'articles. Un design minimaliste pour un style de vie moderne et urbain.
        </p>
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
