
import { NextResponse } from 'next/server';
import { updateOrders, type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const orders: Order[] = await request.json();
    await updateOrders(orders);
    return NextResponse.json({ message: 'Orders updated successfully' });
  } catch (error) {
    console.error('Failed to update orders in Firestore:', error);
    return NextResponse.json({ message: 'Failed to update orders' }, { status: 500 });
  }
}
