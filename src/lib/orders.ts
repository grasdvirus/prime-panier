import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { type CartItem } from '@/contexts/cart-context';

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
    items: CartItem[];
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

export async function createOrder(order: Order): Promise<void> {
    const orders = await getOrders();
    orders.unshift(order); // Add to the beginning of the array
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function updateOrders(orders: Order[]): Promise<void> {
    await ensureFileExists();
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
}
