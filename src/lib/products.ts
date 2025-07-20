
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

async function fetchProducts(): Promise<Product[]> {
    if (productsCache) {
        return productsCache;
    }
    try {
        // Assuming the app is served from the root, /products.json will resolve to public/products.json
        const response = await fetch('/products.json');
        if (!response.ok) {
            console.error('Failed to fetch products.json:', response.statusText);
            return [];
        }
        const products: Product[] = await response.json();
        productsCache = products;
        return products;
    } catch (error) {
        console.error('Failed to read or parse products.json:', error);
        return [];
    }
}

export async function getProducts(): Promise<Product[]> {
  return await fetchProducts();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.id === id);
}

export async function getProductCategories(): Promise<string[]> {
  const products = await fetchProducts();
  return [...new Set(products.map(p => p.category))];
}
