
'use client';

import React, { useState, useMemo } from 'react';
import { type Product } from '@/lib/products';
import { ProductCard } from './product-card';
import { ProductFilters } from './product-filters';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [filters, setFilters] = useState({
    category: 'all',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    
    return filtered;
  }, [products, filters.category]);

  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">Nouveaux Produits</h2>
      <ProductFilters products={products} filters={filters} setFilters={setFilters} />
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
        </div>
      )}
    </section>
  );
}
