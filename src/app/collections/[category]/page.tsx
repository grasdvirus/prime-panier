import { getProducts, getProductCategories } from '@/lib/products';
import { ProductGrid } from '@/components/products/product-grid';
import { notFound } from 'next/navigation';

type CollectionPageProps = {
  params: {
    category: string;
  };
};

export async function generateStaticParams() {
  const categories = await getProductCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const allProducts = await getProducts();
  const category = decodeURIComponent(params.category);
  
  const products = allProducts.filter(p => p.category === category);

  if (products.length === 0) {
    // Optional: You might want to check if the category itself is valid
    // even if there are no products, to distinguish between an empty
    // collection and a truly non-existent one.
    const allCategories = await getProductCategories();
    if (!allCategories.includes(category)) {
      notFound();
    }
  }

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Collection: {category}</h1>
        <p className="text-muted-foreground mt-2">
            Découvrez tous les articles de la collection {category}.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
