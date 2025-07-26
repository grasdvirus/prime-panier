// Client-side functions for orders

import { type Order, type OrderRequest } from './orders';

export async function createOrderClient(order: OrderRequest): Promise<void> {
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }));
    throw new Error(errorData.message);
  }
}

export async function getOrdersClient(): Promise<Order[]> {
    try {
        const response = await fetch(`/orders.json?v=${new Date().getTime()}`);
        if (!response.ok) {
            console.error('Failed to fetch orders.json:', response.statusText);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to read or parse orders.json:', error);
        return [];
    }
}

export async function updateOrdersClient(orders: Order[]): Promise<void> {
  const response = await fetch('/admin/update-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders, null, 2),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update orders' }));
    throw new Error(errorData.message);
  }
}
