import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Order } from '@/lib/orders';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ordersSnapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
    
    if (ordersSnapshot.empty) {
      return NextResponse.json([]);
    }
    
    const orders: Order[] = ordersSnapshot.docs.map(doc => doc.data() as Order);
    return NextResponse.json(orders);

  } catch (error) {
    console.error('Failed to get orders from Firestore:', error);
    return NextResponse.json({ message: 'Failed to retrieve orders' }, { status: 500 });
  }
}
