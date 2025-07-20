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

    switch (filters.sort) {
      case 'popularity':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  return (
    <section>
      <ProductFilters filters={filters} setFilters={setFilters} />
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
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
