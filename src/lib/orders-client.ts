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
