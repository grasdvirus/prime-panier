import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const updatedOrder: Order = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'orders.json');
    
    let orders: Order[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      orders = JSON.parse(fileContent);
    } catch (e) {
      // File might not exist, but it should if we are updating an order.
      // We can throw an error or just let it create a new file with the single order.
      // For robustness, let's assume the file must exist.
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json({ message: 'Orders file not found.' }, { status: 404 });
      }
      throw e;
    }

    const orderIndex = orders.findIndex(o => o.id === updatedOrder.id);
    
    if (orderIndex === -1) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update the specific order
    orders[orderIndex] = updatedOrder;

    // Write the entire updated list back to the file
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error: any) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
