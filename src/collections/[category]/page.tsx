import { getProducts, getProductCategories } from '@/lib/products';
import { ProductGrid } from '@/components/products/product-grid';
import { notFound } from 'next/navigation';

type CollectionPageProps = {
  params: {
    category: string;
  };
};

// Suppression de generateStaticParams pour rendre la page entièrement dynamique.
// Cela évite les erreurs 404 en production si les catégories ne sont pas
// correctement détectées au moment du build.

export default async function CollectionPage({ params }: CollectionPageProps) {
  const allProducts = await getProducts();
  const category = decodeURIComponent(params.category);
  
  // On vérifie que la catégorie demandée est une catégorie valide
  const allCategories = await getProductCategories();
  if (!allCategories.includes(category)) {
    notFound();
  }
  
  const products = allProducts.filter(p => p.category === category);

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Collection: {category}</h1>
        <p className="text-muted-foreground mt-2">
            Découvrez tous les articles de la collection {category}.
        </p>
      </div>
      {products.length > 0 ? (
         <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Il n'y a aucun produit dans cette collection pour le moment.</p>
        </div>
      )}
    </div>
  );
}
