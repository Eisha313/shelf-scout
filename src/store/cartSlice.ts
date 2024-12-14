import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem('shelf-scout-cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate cart items have required fields
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is CartItem =>
            item &&
            typeof item.quantity === 'number' &&
            item.quantity > 0 &&
            item.product &&
            typeof item.product.id === 'number'
        );
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem('shelf-scout-cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.id
      );

      if (existingIndex !== -1) {
        // Fix: Ensure quantity doesn't exceed available stock
        const currentQty = state.items[existingIndex].quantity;
        const maxQty = action.payload.stock ?? 99;
        state.items[existingIndex].quantity = Math.min(currentQty + 1, maxQty);
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.product.id === productId
      );

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Fix: Remove item when quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          // Fix: Clamp quantity to available stock
          const maxQty = state.items[itemIndex].product.stock ?? 99;
          state.items[itemIndex].quantity = Math.min(Math.max(1, quantity), maxQty);
        }
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
