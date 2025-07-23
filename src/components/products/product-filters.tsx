'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getProductsClient } from '@/lib/products-client';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: { category: string; };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; sort: string; }>>;
}

async function getCategoriesClient(): Promise<string[]> {
    try {
        const products = await getProductsClient();
        return ['all', ...new Set(products.map(p => p.category))];
    } catch (error) {
        console.error('Failed to get categories:', error);
        return ['all'];
    }
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
    const [categories, setCategories] = useState<string[]>(['all']);

    useEffect(() => {
        async function fetchCategories() {
            const fetchedCategories = await getCategoriesClient();
            setCategories(fetchedCategories);
        }
        fetchCategories();
    }, []);

    const handleCategoryChange = (category: string) => {
      setFilters(f => ({ ...f, category }));
    }

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
      {categories.map((category) => (
         <Button
            key={category}
            variant={filters.category === category ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(category)}
            className={cn(
              "rounded-full px-6",
              filters.category === category ? 'bg-primary text-primary-foreground' : 'bg-transparent'
            )}
          >
            {category === 'all' ? 'Tous' : category}
          </Button>
      ))}
    </div>
  );
}
