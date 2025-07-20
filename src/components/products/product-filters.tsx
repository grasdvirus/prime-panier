'use client';

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { getProductsClient } from '@/lib/products-client';

interface ProductFiltersProps {
  filters: { category: string; sort: string };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; sort: string }>>;
}

async function getCategoriesClient(): Promise<string[]> {
    try {
        const products = await getProductsClient();
        return [...new Set(products.map(p => p.category))];
    } catch (error) {
        console.error('Failed to get categories:', error);
        return [];
    }
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
    const [categories, setCategories] = useState<string[]>(['all']);

    useEffect(() => {
        async function fetchCategories() {
            const fetchedCategories = await getCategoriesClient();
            setCategories(['all', ...fetchedCategories]);
        }
        fetchCategories();
    }, []);

    const handleReset = () => {
        setFilters({ category: 'all', sort: 'popularity' });
    }

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
            <label htmlFor="category-select" className="text-sm font-medium text-muted-foreground">Catégorie</label>
            <Select
                value={filters.category}
                onValueChange={(value) => setFilters((f) => ({ ...f, category: value }))}
            >
                <SelectTrigger id="category-select" className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'Toutes' : cat}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm font-medium text-muted-foreground">Trier par</label>
        <Select
            value={filters.sort}
            onValueChange={(value) => setFilters((f) => ({ ...f, sort: value }))}
        >
            <SelectTrigger id="sort-select" className="w-[180px]">
            <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="popularity">Popularité</SelectItem>
            <SelectItem value="price-asc">Prix: Croissant</SelectItem>
            <SelectItem value="price-desc">Prix: Décroissant</SelectItem>
            </SelectContent>
        </Select>
        </div>
      </div>
      <Button variant="ghost" onClick={handleReset}>Réinitialiser</Button>
    </div>
  );
}
