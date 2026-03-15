// ==========================================
// Shopping Cart Store (Zustand)
// ==========================================
// Think of this as the app's "shopping bag brain".
// Any screen can add/remove items, and the bag
// screen will instantly reflect the changes.

import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  totalAmount: number;

  // Actions (functions that change the data)
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Helper: recalculate total from items
const calcTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,

  // Add a product to the cart
  addItem: (product, size, color) =>
    set((state) => {
      // Check if this exact product+size+color already exists
      const existingIndex = state.items.findIndex(
        (i) =>
          i.product._id === product._id &&
          i.selectedSize === size &&
          i.selectedColor === color
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        // Already in cart → just increase quantity by 1
        newItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item → add it
        newItems = [
          ...state.items,
          { product, quantity: 1, selectedSize: size, selectedColor: color },
        ];
      }

      return { items: newItems, totalAmount: calcTotal(newItems) };
    }),

  // Remove a product from the cart
  removeItem: (productId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.product._id !== productId);
      return { items: newItems, totalAmount: calcTotal(newItems) };
    }),

  // Update quantity of an item (e.g. user taps + or -)
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.product._id !== productId);
        return { items: newItems, totalAmount: calcTotal(newItems) };
      }
      const newItems = state.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      return { items: newItems, totalAmount: calcTotal(newItems) };
    }),

  // Empty the entire cart (e.g. after checkout)
  clearCart: () => set({ items: [], totalAmount: 0 }),
}));
