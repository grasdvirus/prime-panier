'use server';

/**
 * @fileOverview A flow for creating an order and saving it to Firestore.
 * 
 * - createOrderFlow - A function that handles the order creation process.
 * - OrderRequestSchema - The input type for the createOrderFlow function.
 */

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

// Define Zod schemas for input validation
const OrderItemSchema = z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
});

const OrderCustomerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().optional(),
    address: z.string().min(1),
    notes: z.string().optional(),
});

export const OrderRequestSchema = z.object({
  customer: OrderCustomerSchema,
  items: z.array(OrderItemSchema).min(1),
});

export type OrderRequest = z.infer<typeof OrderRequestSchema>;

export const createOrderFlow = ai.defineFlow(
  {
    name: 'createOrderFlow',
    inputSchema: OrderRequestSchema,
    outputSchema: z.void(),
  },
  async (orderRequest) => {
    try {
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
        console.error('Failed to create order in Firestore from flow:', error);
        // Throw a new error to be caught by the API route
        throw new Error('Failed to create order in Firestore.');
    }
  }
);
