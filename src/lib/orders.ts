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
