'use client';

import React, { useState, useEffect } from 'react';
import { getProductsClient } from '@/lib/products-client';
import { cn } from '@/lib/utils';
import { LayoutGrid, Shirt, Headphones, Home, Package, Sparkles, ToyBrick, Car, Gamepad2 } from 'lucide-react';

interface ProductFiltersProps {
  filters: { category: string; };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; }>>;
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

// TODO: This should be read from a config file or similar
const categoryIcons: { [key: string]: React.ReactNode } = {
  all: <LayoutGrid />,
  'Vêtements': <Shirt />,
  'Accessoires': <Headphones />,
  'Maison': <Home />,
  'Bijoux': <Sparkles />,
  'Jouets': <ToyBrick />,
  'Véhicules': <Car />,
  'Jeux': <Gamepad2 />,
  'Package': <Package />, // Generic icon
};

const getIconForCategory = (category: string) => {
    // This logic needs to be flexible to find icons even if the category name has slight variations
    const iconKey = Object.keys(categoryIcons).find(key => category.toLowerCase().includes(key.toLowerCase()));
    if (iconKey) return categoryIcons[iconKey];

    // Fallback logic for keys that might not match directly
    if (category.toLowerCase().includes('vêtement')) return categoryIcons['Vêtements'];
    if (category.toLowerCase().includes('accessoire')) return categoryIcons['Accessoires'];
    
    return categoryIcons[category] || <Package />;
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
