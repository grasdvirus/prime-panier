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

// This is the type that comes from the client form and the API
export type OrderRequest = Omit<Order, 'total'>;


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
        const orders = JSON.parse(fileContent);
        // Sort orders by creation date, descending
        return orders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error('Failed to read orders.json:', error);
        return [];
    }
}

export async function createOrder(orderRequest: OrderRequest): Promise<void> {
    const orders = await getOrders();
    
    // Calculate total server-side for security
    const subtotal = orderRequest.items.reduce((sum, item) => {
        // Ensure price and quantity are numbers before calculation
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
        return sum + price * quantity;
    }, 0);
    
    // Add shipping costs (e.g., 5000 FCFA if there are items)
    const shipping = subtotal > 0 ? 5000 : 0;
    const total = subtotal + shipping;

    const newOrder: Order = {
        ...orderRequest,
        total: total,
    };

    orders.unshift(newOrder); // Add to the beginning of the array
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function updateOrders(orders: Order[]): Promise<void> {
    await ensureFileExists();
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    await fs.writeFile(ordersFilePath, JSON.stringify(sortedOrders, null, 2), 'utf-8');
}
