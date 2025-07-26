// Client-side functions for products

import { type Product } from './products';

export async function getProductsClient(): Promise<Product[]> {
    try {
        // Use a random query param to prevent caching
        const response = await fetch(`/products.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch products.json:', response.statusText);
            return [];
        }
        const products: Product[] = await response.json();
         // Ensure reviews is always an array
        return products.map(p => ({ ...p, reviews: p.reviews || [] }));

    } catch (error) {
        console.error('Failed to read or parse products.json:', error);
        return [];
    }
}

export async function getProductCategoriesClient(): Promise<string[]> {
    try {
        const products = await getProductsClient();
        const categories = products.map(p => p.category);
        const defaultCategories = ['Vêtements', 'Accessoires', 'Tech', 'Maison'];
        const allCategories = [...new Set([...defaultCategories, ...categories])];
        return allCategories;
    } catch (error) {
        console.error('Failed to get categories on client:', error);
        return ['Vêtements', 'Accessoires', 'Tech', 'Maison'];
    }
}

export async function updateProductsClient(products: Product[]): Promise<void> {
  const response = await fetch('/admin/update-products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products, null, 2),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update products' }));
    throw new Error(errorData.message);
  }
}
