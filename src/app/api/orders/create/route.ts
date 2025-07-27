import { NextResponse } from 'next/server';
import { OrderSchema } from '@/lib/validators/order';

// Force this route to use the Node.js runtime (edge FS is read-only)
export const runtime = 'nodejs';
import { adminDb } from '@/lib/firebase-admin';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    // Validate payload
    const parsed = OrderSchema.parse(await request.json());
    const newOrder: Order = {
      ...parsed,
      id: parsed.id ?? Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

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
