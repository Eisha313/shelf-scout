import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

const STORAGE_KEY = 'shelf-scout-cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure of stored data
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is CartItem =>
            item &&
            typeof item === 'object' &&
            item.product &&
            typeof item.quantity === 'number' &&
            item.quantity > 0
        );
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    // Debounce writes by using a microtask
    queueMicrotask(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    });
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const initialState: CartState = {
  items: [],
  isHydrated: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart(state) {
      if (!state.isHydrated) {
        state.items = loadCartFromStorage();
        state.isHydrated = true;
      }
    },
    addToCart(state, action: PayloadAction<Product>) {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        // Prevent quantity from exceeding available stock
        const maxQuantity = action.payload.stock ?? Infinity;
        existingItem.quantity = Math.min(existingItem.quantity + 1, maxQuantity);
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }

      saveCartToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const index = state.items.findIndex(
        (item) => item.product.id === action.payload
      );
      
      if (index !== -1) {
        state.items.splice(index, 1);
        saveCartToStorage(state.items);
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product.id === productId);

      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(
            (item) => item.product.id !== productId
          );
        } else {
          // Enforce stock limits
          const maxQuantity = item.product.stock ?? Infinity;
          item.quantity = Math.min(Math.max(1, quantity), maxQuantity);
        }
        saveCartToStorage(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
