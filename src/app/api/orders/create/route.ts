import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const newOrder: Order = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'orders.json');
    
    let orders: Order[] = [];
    try {
      // Try to read existing orders
      const fileContent = await fs.readFile(filePath, 'utf-8');
      orders = JSON.parse(fileContent);
    } catch (error) {
      // If the file doesn't exist, it's okay. We'll create it.
      // We only ignore the 'ENOENT' (file not found) error.
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error; // For any other error, we stop execution.
      }
    }

    // Add the new order to the beginning of the array
    orders.unshift(newOrder);

    // Write the updated list back to the file
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Order created successfully' });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    // Send back a more informative error message
    return NextResponse.json({ message: `Server error: ${error.message}` }, { status: 500 });
  }
}
