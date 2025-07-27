import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Product } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const productsSnapshot = await adminDb.collection('products').orderBy('id', 'asc').get();
    
    if (productsSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const products: Product[] = productsSnapshot.docs.map(doc => doc.data() as Product);
    return NextResponse.json(products);

  } catch (error) {
    console.error('Failed to get products from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve products' }, { status: 500 });
  }
}
