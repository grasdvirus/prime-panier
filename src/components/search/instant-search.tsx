'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { type Product } from '@/lib/products';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

async function getProductsClient(): Promise<Product[]> {
    try {
        const response = await fetch('/products.json');
        if (!response.ok) {
            console.error('Failed to fetch products.json:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse products.json:', error);
        return [];
    }
}

export function InstantSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const allProducts = useRef<Product[]>([]);

  useEffect(() => {
    async function fetchAllProducts() {
        allProducts.current = await getProductsClient();
    }
    fetchAllProducts();
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.length > 1) {
      const filtered = allProducts.current
        .filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 5);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const handleSelect = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-xs">
        <Command className="rounded-lg border shadow-md">
            <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                    placeholder="Rechercher un article..."
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
                />
            </div>
            {isOpen && (
                <CommandList>
                    <CommandEmpty>{results.length === 0 && searchTerm.length > 1 ? 'Aucun résultat.' : ''}</CommandEmpty>
                    <CommandGroup>
                        {results.map((product) => (
                        <CommandItem key={product.id} onSelect={handleSelect} value={product.name}>
                            <Link href={`/products/${product.id}`} className="flex items-center w-full">
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="mr-3 rounded-md object-cover"
                                    data-ai-hint={product.data_ai_hint}
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-xs text-muted-foreground">${product.price}</span>
                                </div>
                            </Link>
                        </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            )}
        </Command>
    </div>
  );
}
