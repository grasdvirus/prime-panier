// Client-side functions for orders
import { type Order, type OrderItem } from './orders';
import { type OrderRequest as CreateOrderRequest } from '@/ai/flows/order-flow';

export type OrderRequest = CreateOrderRequest;
export type { Order, OrderItem };


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
        const res = await fetch('/api/orders/get', { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch orders');
        }
        return res.json();
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
