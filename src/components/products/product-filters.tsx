'use client';

import React, { useState, useEffect } from 'react';
import { getProductsClient } from '@/lib/products-client';
import { cn } from '@/lib/utils';
import { LayoutGrid, Shirt, Headphones, Home } from 'lucide-react';

interface ProductFiltersProps {
  filters: { category: string; };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; sort: string; }>>;
}

async function getCategoriesClient(): Promise<string[]> {
    try {
        const products = await getProductsClient();
        return ['all', ...Array.from(new Set(products.map(p => p.category)))];
    } catch (error) {
        console.error('Failed to get categories:', error);
        return ['all'];
    }
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  all: <LayoutGrid />,
  'Vêtements': <Shirt />,
  'Accessoires': <Headphones />,
  'Tech': <Headphones />,
  'Maison': <Home />,
};


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
    <div className="mb-8 flex items-center justify-center">
      <div className="filter-menu">
        {categories.map((category) => (
           <a 
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={cn(
              "filter-link",
              filters.category === category && "active"
            )}
           >
              <span className="filter-link-icon">
                {categoryIcons[category] || <LayoutGrid />}
              </span>
              <span className="filter-link-title">{category === 'all' ? 'Tous' : category}</span>
            </a>
        ))}
      </div>
    </div>
  );
}
