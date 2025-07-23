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
    sort: 'popularity',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // You can re-add sorting logic here if needed, for now it's removed to match the new design
    // switch (filters.sort) { ... }

    return filtered;
  }, [products, filters]);

  return (
    <section className="max-w-7xl mx-auto">
      <ProductFilters filters={filters} setFilters={setFilters} />
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
