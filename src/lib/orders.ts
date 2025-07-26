'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

export type OrderCustomer = {
    name: string;
    phone: string;
    email?: string;
    address: string;
    notes?: string;
}

export type Order = {
    id: string; // Firestore ID is a string
    customer: OrderCustomer;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
    createdAt: any; // Firestore timestamp
}

export type OrderRequest = {
    customer: OrderCustomer;
    items: OrderItem[];
};

export async function getOrders(): Promise<Order[]> {
    try {
        const ordersCollection = adminDb.collection('orders');
        const q = ordersCollection.orderBy('createdAt', 'desc');
        const orderSnapshot = await q.get();

        if (orderSnapshot.empty) {
            return [];
        }

        const ordersList = orderSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            } as Order;
        });
        return ordersList;
    } catch (error) {
        console.error('Failed to get orders from Firestore:', error);
        throw new Error('Failed to retrieve orders from Firestore.');
    }
}

export async function createOrder(orderRequest: OrderRequest): Promise<void> {
    try {
        if (!orderRequest.customer || 
            !orderRequest.customer.name ||
            !orderRequest.customer.phone ||
            !orderRequest.customer.address ||
            !orderRequest.items || 
            orderRequest.items.length === 0) {
          throw new Error('Invalid or incomplete order data.');
        }

        const subtotal = orderRequest.items.reduce((sum, item) => {
            const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
            const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
            return sum + price * quantity;
        }, 0);
        
        const shipping = subtotal > 0 ? 5000 : 0;
        const total = subtotal + shipping;

        const newOrder = {
            customer: orderRequest.customer,
            items: orderRequest.items,
            total: total,
            status: 'pending' as const,
            createdAt: FieldValue.serverTimestamp(),
        };

        await adminDb.collection('orders').add(newOrder);

    } catch (error) {
        console.error('Failed to create order in Firestore:', error);
        throw new Error('Failed to create order in Firestore.');
    }
}

export async function updateOrders(orders: Order[]): Promise<void> {
    try {
        if (!orders || orders.length === 0) {
            return;
        }
        const batch = adminDb.batch();
        orders.forEach(order => {
            if (!order.id) {
                console.warn("Skipping order with no ID:", order);
                return;
            }
            const { id, ...orderData } = order;
            const orderRef = adminDb.collection('orders').doc(id);
            batch.update(orderRef, { status: orderData.status });
        });
        await batch.commit();
    } catch (error) {
        console.error("Failed to batch update orders in Firestore:", error);
        throw new Error('Failed to update orders.');
    }
}
