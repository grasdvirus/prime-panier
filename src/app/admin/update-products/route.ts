import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Product } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const products: Product[] = await request.json();
    
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

    const batch = adminDb.batch();
    const collectionRef = adminDb.collection('products');
    
    const snapshot = await collectionRef.get();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    productsWithRating.forEach(product => {
        const docRef = collectionRef.doc(product.id.toString());
        batch.set(docRef, product);
    });

    await batch.commit();

    return NextResponse.json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Failed to update products in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update products' }, { status: 500 });
  }
}
