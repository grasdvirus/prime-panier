'use client';

import { getProductCategories } from '@/lib/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';

interface ProductFiltersProps {
  filters: { category: string; sort: string };
  setFilters: React.Dispatch<React.SetStateAction<{ category: string; sort: string }>>;
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
    const categories = ['all', ...getProductCategories()];

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
