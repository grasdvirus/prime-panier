
import 'server-only';
import { adminDb } from './firebase-admin';

export type ProductReview = {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string; // ISO date string
}

export type ProductOption = {
  name: string;
  values: string[];
}

export type ProductVariant = {
  id: number;
  options: string[];
  price: number;
  stock: number;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  stock: number;
  reviews: ProductReview[];
  images: string[];
  features: string[];
  data_ai_hint: string;
  likes: number;
  hasVariants: boolean;
  options: ProductOption[];
  variants: ProductVariant[];
};


async function fetchProductsOnServer(): Promise<Product[]> {
    try {
        const productsSnapshot = await adminDb.collection('products').orderBy('id', 'desc').get();
        if (productsSnapshot.empty) {
            return [];
        }
        const products = productsSnapshot.docs.map(doc => doc.data() as Product);
        return products.map(p => ({ 
            ...p, 
            reviews: p.reviews || [], 
            likes: p.likes || 0,
            hasVariants: p.hasVariants ?? false,
            options: p.options || [],
            variants: p.variants || [],
        }));
    } catch (error) {
        console.error('Failed to fetch products from Firestore:', error);
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
  const defaultCategories = ['Vêtements', 'Accessoires', 'Maison', 'Bijoux', 'Jouets', 'Véhicules', 'Jeux'];
  const allCategories = [...new Set([...defaultCategories, ...categories])];
  return allCategories;
}

    
