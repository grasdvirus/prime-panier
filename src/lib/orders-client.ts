// Client-side functions for orders
import { getOrders as getOrdersFromServer, updateOrders as updateOrdersOnServer, type Order, type OrderRequest } from './orders';

export { type OrderRequest, type Order };

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

// Note: These client functions now wrap server functions.
// This might not be the final architecture, but it adapts the existing admin panel
// to the new Firestore backend without a full rewrite of the admin panel's client-side logic.

export async function getOrdersClient(): Promise<Order[]> {
    // This is not ideal as it calls the serverless function from the client.
    // A better approach would be to fetch directly from Firestore on the client with security rules.
    // But for now, we'll proxy through a dedicated API route if needed, or call server function directly if in same context.
    // For now, let's assume we need an API route for this.
    try {
        const res = await fetch('/api/orders/get');
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
