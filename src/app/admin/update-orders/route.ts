
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { type Order } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const updatedOrders: Order[] = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'orders.json');
    
    // Read the existing orders to update statuses, not replace the file
    let existingOrders: Order[] = [];
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        existingOrders = JSON.parse(fileContent);
    } catch (e) {
        // File might not exist, that's okay
    }

    const ordersMap = new Map(existingOrders.map(o => [o.id, o]));
    updatedOrders.forEach(order => {
        if (ordersMap.has(order.id)) {
            const existingOrder = ordersMap.get(order.id);
            if(existingOrder) {
                existingOrder.status = order.status;
            }
        }
    });

    const ordersToSave = Array.from(ordersMap.values());

    await fs.writeFile(filePath, JSON.stringify(ordersToSave, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Orders updated successfully' });
  } catch (error) {
    console.error('Failed to update orders.json:', error);
    return NextResponse.json({ message: 'Failed to update orders' }, { status: 500 });
  }
}
