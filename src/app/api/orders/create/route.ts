import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const newOrder: Order = await request.json();

    // Use the order ID as the document ID in Firestore for consistency
    const orderRef = adminDb.collection('orders').doc(newOrder.id);
    await orderRef.set(newOrder);

    return NextResponse.json({ message: 'Order created successfully' });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    // Send back a more informative error message
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
