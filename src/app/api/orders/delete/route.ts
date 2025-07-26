import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const { id: orderIdToDelete } = await request.json();

    if (!orderIdToDelete) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'orders.json');
    
    let orders: Order[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      orders = JSON.parse(fileContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, so nothing to delete.
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      throw error;
    }

    const updatedOrders = orders.filter(order => order.id !== orderIdToDelete);

    if (orders.length === updatedOrders.length) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(updatedOrders, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
