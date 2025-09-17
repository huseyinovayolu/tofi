import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, calculateMWST } from '@tofi/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  
  // Computed values
  getTotalItems: () => number;
  getSubtotal: () => number;
  getMWST: () => number;
  getTotal: () => number;
  getShippingCost: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product) => {
        const items = get().items;
        const existingItem = items.find(item => item.productId === product.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                quantity: 1,
                price: product.price,
              },
            ],
          });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.productId !== productId),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getMWST: () => {
        return calculateMWST(get().getSubtotal());
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 100 ? 0 : 9.90; // Free shipping over CHF 100
      },

      getTotal: () => {
        return get().getSubtotal() + get().getMWST() + get().getShippingCost();
      },
    }),
    {
      name: 'tofi-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);