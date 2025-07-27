// Client-side functions for orders
import { type Order } from './orders';
import { adminDb } from './firebase-admin';

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

// This function now fetches from Firestore on the server-side for the admin page.
// The client-side fetch from a JSON file is no longer needed.
// We will call this from a server component or a route handler.
export async function getOrdersAdmin(): Promise<Order[]> {
    try {
        const ordersSnapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
        if (ordersSnapshot.empty) {
            return [];
        }
        return ordersSnapshot.docs.map(doc => doc.data() as Order);
    } catch (error) {
        console.error('Error getting orders from Firestore:', error);
        return [];
    }
}
