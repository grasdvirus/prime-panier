// Client-side functions for orders
import { type Order, type OrderItem } from './orders';

export type { Order, OrderItem };

export async function createOrderClient(order: Order): Promise<void> {
  const response = await fetch('/api/create-order', {
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
        const res = await fetch(`/orders.json?v=${new Date().getTime()}`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch orders');
        }
        const orders = await res.json();
        // Sort orders from newest to oldest
        return orders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error('Error in getOrdersClient:', error);
        return [];
    }
}

export async function updateOrdersClient(orders: Order[]): Promise<void> {
  const response = await fetch('/admin/update-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update orders' }));
    throw new Error(errorData.message);
  }
}
