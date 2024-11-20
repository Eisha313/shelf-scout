import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import filtersReducer from './filtersSlice';

const loadCartFromStorage = (): ReturnType<typeof cartReducer> | undefined => {
  try {
    const serializedCart = localStorage.getItem('shelf-scout-cart');
    if (serializedCart === null) {
      return undefined;
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error('Failed to load cart from localStorage:', err);
    return undefined;
  }
};

const saveCartToStorage = (state: ReturnType<typeof cartReducer>) => {
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem('shelf-scout-cart', serializedCart);
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filters: filtersReducer,
  },
  preloadedState: {
    cart: loadCartFromStorage(),
  },
});

store.subscribe(() => {
  saveCartToStorage(store.getState().cart);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;