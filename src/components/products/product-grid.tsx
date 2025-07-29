
'use client';

import React, { useState, useMemo } from 'react';
import { type Product } from '@/lib/products';
import { ProductCard } from './product-card';
import { ProductFilters } from './product-filters';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title?: string;
  paginated?: boolean;
  productsPerPage?: number;
}

const PaginationControls = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="mt-12 flex items-center justify-center gap-2">
             <Button
                variant="glass"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9"
            >
                <ChevronLeft />
            </Button>
            {pageNumbers.map(number => (
                <Button
                    key={number}
                    variant="glass"
                    size="icon"
                    onClick={() => onPageChange(number)}
                    className={cn(
                        "h-9 w-9",
                        currentPage === number && "border-primary/50 text-primary"
                    )}
                >
                    {number}
                </Button>
            ))}
            <Button
                variant="glass"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                 className="h-9 w-9"
            >
                <ChevronRight />
            </Button>
        </nav>
    )
}

export function ProductGrid({ 
  products, 
  title = "Nos Produits", 
  paginated = false, 
  productsPerPage = 8 
}: ProductGridProps) {
  const [filters, setFilters] = useState({ category: 'all' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    return filtered;
  }, [products, filters.category]);

  const paginatedProducts = useMemo(() => {
    if (!paginated) return filteredProducts;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);

  }, [filteredProducts, paginated, currentPage, productsPerPage]);

  const totalPages = paginated ? Math.ceil(filteredProducts.length / productsPerPage) : 1;

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.category]);


  return (
    <section className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter text-center mb-8">{title}</h2>
      <ProductFilters products={products} filters={filters} setFilters={setFilters} />
      {paginatedProducts.length > 0 ? (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {paginated && (
                <PaginationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
        </div>
      )}
    </section>
  );
}
