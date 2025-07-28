'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { type Product } from '@/lib/products';
import { cn } from '@/lib/utils';
import { LayoutGrid, Shirt, Headphones, Home, Package, Sparkles, ToyBrick, Car, Gamepad2 } from 'lucide-react';

interface ProductFiltersProps {
  products: Product[];
  filters: { category: string; };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; }>>;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'all': <LayoutGrid />,
  'Vêtements': <Shirt />,
  'Accessoires': <Headphones />,
  'Maison': <Home />,
  'Bijoux': <Sparkles />,
  'Jouets': <ToyBrick />,
  'Véhicules': <Car />,
  'Jeux': <Gamepad2 />,
  'Package': <Package />, // Generic fallback
};

const getIconForCategory = (category: string) => {
    return categoryIcons[category] || <Package />;
};

export function ProductFilters({ products, filters, setFilters }: ProductFiltersProps) {
    const categories = useMemo(() => {
        const productCategories = products.map(p => p.category);
        return ['all', ...Array.from(new Set(productCategories))];
    }, [products]);

    const handleCategoryChange = (category: string) => {
      setFilters(f => ({ ...f, category }));
    }

  return (
    <div className="mb-8 flex items-center justify-center w-full">
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
                {getIconForCategory(category)}
              </span>
              <span className="filter-link-title">{category === 'all' ? 'Tous' : category}</span>
            </a>
        ))}
      </div>
    </div>
  );
}
