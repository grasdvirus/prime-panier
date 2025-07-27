import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Product } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const products: Product[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'products.json');
    
    // Calculate average rating from reviews for each product
    const productsWithRating = products.map(product => {
      const reviews = product.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
      
      return { 
        ...product, 
        rating: parseFloat(averageRating.toFixed(1)),
        likes: product.likes || 0 // Ensure likes is initialized
      };
    });

    await fs.writeFile(filePath, JSON.stringify(productsWithRating, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Failed to write products.json:', error);
    return NextResponse.json({ message: 'Failed to update products' }, { status: 500 });
  }
}
