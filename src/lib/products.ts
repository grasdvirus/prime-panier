import 'server-only';

import fs from 'fs/promises';
import path from 'path';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Accessoires' | 'Vêtements' | 'Tech' | 'Maison';
  rating: number;
  stock: number;
  reviews: number;
  images: string[];
  features: string[];
  data_ai_hint: string;
};

let productsCache: Product[] | null = null;

// This function is marked as 'server-only' and will be used by server components.
async function fetchProductsOnServer(): Promise<Product[]> {
    if (productsCache) {
        return productsCache;
    }
    try {
        const filePath = path.join(process.cwd(), 'public', 'products.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContent);
        productsCache = products;
        return products;
    } catch (error) {
        console.error('Failed to read or parse products.json:', error);
        return [];
    }
}

export async function getProducts(): Promise<Product[]> {
  return await fetchProductsOnServer();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await fetchProductsOnServer();
  return products.find((p) => p.id === id);
}

export async function getProductCategories(): Promise<string[]> {
  const products = await fetchProductsOnServer();
  return [...new Set(products.map(p => p.category))];
}
