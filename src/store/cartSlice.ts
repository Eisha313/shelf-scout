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

const CART_STORAGE_KEY = 'shelf-scout-cart';

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate cart structure
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is CartItem =>
            item &&
            typeof item === 'object' &&
            item.product &&
            typeof item.product.id === 'number' &&
            typeof item.quantity === 'number' &&
            item.quantity > 0
        );
      }
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex !== -1) {
        // Use Math.max to prevent negative quantities
        state.items[existingIndex].quantity = Math.max(
          1,
          state.items[existingIndex].quantity + quantity
        );
      } else if (quantity > 0) {
        state.items.push({ product, quantity });
      }

      saveCartToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);
      saveCartToStorage(state.items);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.product.id === productId
      );

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },
    incrementQuantity(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const item = state.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity += 1;
        saveCartToStorage(state.items);
      }
    },
    decrementQuantity(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.product.id === productId
      );

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item when quantity would become 0
          state.items.splice(itemIndex, 1);
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

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
