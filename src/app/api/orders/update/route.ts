import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const updatedOrder: Order = await request.json();
    
    const orderRef = adminDb.collection('orders').doc(updatedOrder.id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update the specific order
    await orderRef.update(updatedOrder);
    
    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error: any) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
