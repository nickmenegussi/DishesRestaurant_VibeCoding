
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Dish } from './MenuContext';
import { useToast } from '../components/ui/Toast';
import { orderService } from '../../backend/index';

export interface CartItem extends Dish {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: Dish, quantity?: number) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { addToast } = useToast();

  // Load cart from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('gbm_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('gbm_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (dish: Dish, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...dish, quantity }];
    });
    addToast(`Added ${quantity}x ${dish.name} to cart`, 'success');
  };

  const removeFromCart = (dishId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(dishId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const checkout = async () => {
      if (items.length === 0) return;
      try {
          const formattedItems = items.map(i => ({ id: i.id, quantity: i.quantity }));
          // The backend service handles user_id from session automatically in RLS/Supabase 
          // if we are using the same client, but for clarity we just call the service.
          await orderService.createOrder(formattedItems, totalPrice);
          
          clearCart();
          addToast('Order placed successfully!', 'success');
      } catch (error: any) {
          console.error('Checkout failed', error);
          addToast(error.message || 'Failed to place order. Please try again.', 'error');
          throw error;
      }
  };


  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      totalItems,
      totalPrice
    }}>
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
