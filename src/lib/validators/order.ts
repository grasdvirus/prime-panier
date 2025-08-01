import { z } from 'zod';

/**
 * Schéma Zod complet pour valider les commandes reçues via l'API.
 * Utilisable aussi bien côté serveur (route handler) que dans les tests / UI.
 */
export const OrderItemSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(val => val.toString()),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const OrderCustomerSchema = z.object({
  uid: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string(),
});

export const OrderSchema = z.object({
  id: z.string().optional(),
  items: z.array(OrderItemSchema),
  total: z.number().positive(),
  customer: OrderCustomerSchema,
  createdAt: z.string().optional(), // ISO date
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
