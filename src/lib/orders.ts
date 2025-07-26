import 'server-only';
import fs from 'fs/promises';
import path from 'path';

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
    id: number;
    customer: OrderCustomer;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
    createdAt: string;
}

const ordersFilePath = path.join(process.cwd(), 'public', 'orders.json');

// Ensure the file exists
async function ensureFileExists() {
    try {
        await fs.access(ordersFilePath);
    } catch {
        await fs.writeFile(ordersFilePath, JSON.stringify([]), 'utf-8');
    }
}

export async function getOrders(): Promise<Order[]> {
    await ensureFileExists();
    try {
        const fileContent = await fs.readFile(ordersFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Failed to read orders.json:', error);
        return [];
    }
}

export async function createOrder(order: Omit<Order, 'total'>): Promise<void> {
    const orders = await getOrders();
    
    // Calculate total server-side for security
    const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder: Order = {
        ...order,
        total: total + 5000, // Add shipping cost
    }

    orders.unshift(newOrder); // Add to the beginning of the array
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function updateOrders(orders: Order[]): Promise<void> {
    await ensureFileExists();
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
}
