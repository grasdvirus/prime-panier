
import 'server-only';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';

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

// This is the type that comes from the client form and the API
export type OrderRequest = {
    customer: OrderCustomer;
    items: OrderItem[];
};

export async function getOrders(): Promise<Order[]> {
    try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const orderSnapshot = await getDocs(q);
        const ordersList = orderSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to a serializable format (ISO string)
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            } as Order;
        });
        return ordersList;
    } catch (error) {
        console.error('Failed to get orders from Firestore:', error);
        return [];
    }
}

export async function createOrder(orderRequest: OrderRequest): Promise<void> {
    try {
        const subtotal = orderRequest.items.reduce((sum, item) => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
            return sum + price * quantity;
        }, 0);
        
        const shipping = subtotal > 0 ? 5000 : 0;
        const total = subtotal + shipping;

        const newOrder = {
            customer: orderRequest.customer,
            items: orderRequest.items,
            total: total,
            status: 'pending',
            createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'orders'), newOrder);

    } catch (error) {
        console.error('Failed to create order in Firestore:', error);
        // Re-throw the error to be caught by the API route
        throw new Error('Failed to create order.');
    }
}

export async function updateOrders(orders: Order[]): Promise<void> {
    try {
        const batch = writeBatch(db);
        orders.forEach(order => {
            const { id, ...orderData } = order;
            // Note: We don't update createdAt to preserve the original order date
            const orderRef = doc(db, 'orders', id);
            batch.update(orderRef, { status: orderData.status });
        });
        await batch.commit();
    } catch (error) {
        console.error("Failed to batch update orders in Firestore:", error);
        throw new Error('Failed to update orders.');
    }
}
