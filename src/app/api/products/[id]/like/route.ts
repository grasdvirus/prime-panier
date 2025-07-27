import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    if (!productId) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    const productRef = adminDb.collection('products').doc(productId);
    
    await productRef.update({
        likes: FieldValue.increment(1)
    });

    const updatedDoc = await productRef.get();
    if (!updatedDoc.exists) {
        return NextResponse.json({ message: 'Product not found after update' }, { status: 404 });
    }

    return NextResponse.json(updatedDoc.data());

  } catch (error) {
    console.error('Failed to like product:', error);
    return NextResponse.json({ message: 'Failed to like product' }, { status: 500 });
  }
}
