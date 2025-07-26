// Client-side functions for orders
import { type Order } from './orders';

export type { Order };

export async function createOrderClient(order: Order): Promise<void> {
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

export async function deleteOrderClient(orderId: string): Promise<void> {
  const response = await fetch('/api/orders/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: orderId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to delete order' }));
    throw new Error(errorData.message);
  }
}

export async function updateOrderClient(order: Order): Promise<void> {
  const response = await fetch('/api/orders/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update order' }));
    throw new Error(errorData.message);
  }
}

export async function getOrdersClient(): Promise<Order[]> {
    try {
        const res = await fetch(`/orders.json?v=${new Date().getTime()}`, { cache: 'no-store' });
        if (!res.ok) {
            // If the file doesn't exist (e.g., no orders yet), return an empty array.
            if (res.status === 404) {
                return [];
            }
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
