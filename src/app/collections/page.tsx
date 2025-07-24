import { getProducts, getProductCategories } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Collection } from '@/lib/collections';

// We'll create a "synthetic" collection card from product categories
function CollectionCard({ category, image, hint }: { category: string, image: string, hint: string }) {
  return (
    <Link href={`/collections/${encodeURIComponent(category)}`} className="group block h-full">
      <div className={cn('bento-card-wrapper h-full')}>
        <Card className="bento-card h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl bg-card border-border/60 relative">
          <Image
            src={image || 'https://placehold.co/400x500.png'}
            alt={category}
            width={400}
            height={500}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={hint}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          <CardContent className="relative flex h-[250px] items-end justify-center p-4">
            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors text-center">{category}</h3>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}

export default async function CollectionsPage() {
  const products = await getProducts();
  const categories = await getProductCategories();
  
  const collectionsData = categories.map(category => {
    const productInCategory = products.find(p => p.category === category);
    return {
      name: category,
      // Use first product image as collection image, or a placeholder
      image: productInCategory?.images[0] ?? 'https://placehold.co/400x500.png', 
      hint: productInCategory?.data_ai_hint ?? 'fashion',
    }
  })

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter">Collections</h1>
        <p className="text-muted-foreground mt-2">
          Parcourez nos collections pour trouver votre style.
        </p>
      </div>

      {collectionsData.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsData.map((collection) => (
            <CollectionCard key={collection.name} category={collection.name} image={collection.image} hint={collection.hint} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Aucune collection disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
}
