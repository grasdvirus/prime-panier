
import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders';

export const dynamic = 'force-dynamic'; // Ensures the function is always run dynamically

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to get orders:', error);
    return NextResponse.json({ message: 'Failed to retrieve orders' }, { status: 500 });
  }
}
