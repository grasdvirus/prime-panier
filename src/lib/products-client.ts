
// Client-side functions for products

import { type Product } from './products';

export async function getProductsClient(): Promise<Product[]> {
    const res = await fetch('/api/products/get', { cache: 'no-store' });
    if (!res.ok) {
        console.error('Failed to fetch products from API:', res.statusText);
        return [];
    }
    const products: Product[] = await res.json();
    return products.map(p => ({ 
        ...p, 
        reviews: p.reviews || [], 
        likes: p.likes || 0,
        hasVariants: p.hasVariants ?? false,
        options: p.options || [],
        variants: p.variants || [],
    }));
}

export async function getProductCategoriesClient(): Promise<string[]> {
    try {
        const products = await getProductsClient();
        const categories = products.map(p => p.category);
        const defaultCategories = ['Vêtements', 'Accessoires', 'Maison', 'Bijoux', 'Jouets', 'Véhicules', 'Jeux'];
        const allCategories = [...new Set([...defaultCategories, ...categories])];
        return allCategories;
    } catch (error) {
        console.error('Failed to get categories on client:', error);
        return ['Vêtements', 'Accessoires', 'Maison', 'Bijoux', 'Jouets', 'Véhicules', 'Jeux'];
    }
}

export async function updateProductsClient(products: Product[]): Promise<void> {
  const response = await fetch('/admin/update-products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(products),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update products' }));
    throw new Error(errorData.message);
  }
}

    
