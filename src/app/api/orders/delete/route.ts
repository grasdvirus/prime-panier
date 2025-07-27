import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { id: orderIdToDelete } = await request.json();

    if (!orderIdToDelete) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const orderRef = adminDb.collection('orders').doc(orderIdToDelete);
    const doc = await orderRef.get();

    if (!doc.exists) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    await orderRef.delete();

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
