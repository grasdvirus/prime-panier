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

async function fetchProductsOnServer(): Promise<Product[]> {
    // In a real app, you'd fetch from a database.
    // For this demo, we read from a local JSON file.
    // We cache it in memory to avoid re-reading the file on every request.
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
        // If the file doesn't exist or is invalid, return empty array
        // and log the error.
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
