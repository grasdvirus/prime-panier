import 'server-only';
import fs from 'fs/promises';
import path from 'path';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string; // Changed from enum to string to support dynamic categories
  rating: number;
  stock: number;
  reviews: number;
  images: string[];
  features: string[];
  data_ai_hint: string;
};

const productsFilePath = path.join(process.cwd(), 'public', 'products.json');

async function fetchProductsOnServer(): Promise<Product[]> {
    try {
        const fileContent = await fs.readFile(productsFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContent);
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
  const categories = products.map(p => p.category);
  // Add default categories if they don't exist
  const defaultCategories = ['Vêtements', 'Accessoires', 'Tech', 'Maison'];
  const allCategories = [...new Set([...defaultCategories, ...categories])];
  return allCategories;
}
