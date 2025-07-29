
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type Product, type ProductVariant } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
  id: string; // Unique ID for the cart item, e.g., "product_1-variant_2"
  product: Product;
  quantity: number;
  variant?: ProductVariant;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage', error);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('cart', JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart to localStorage', error);
        }
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1, variant?: ProductVariant) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : `${product.id}`;
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === cartItemId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { id: cartItemId, product, quantity, variant }];
    });
    toast({
      title: 'Ajouté au panier',
      description: `${product.name} ${variant ? `(${variant.options.join(', ')})` : ''} a été ajouté à votre panier.`,
    });
    setCartOpen(true);
  }, [toast]);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId);
      }
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => {
        const price = item.variant?.price ?? item.product.price;
        return total + price * item.quantity;
    }, 0);
  }, [items]);

  const getCartItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isCartOpen,
        setCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
