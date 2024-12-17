import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  CartItem,
} from '../store/cartSlice';
import { Product } from '../types/product';

interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  clear: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

export const useCart = (): UseCartReturn => {
  const dispatch = useDispatch();
  const { items, isHydrated } = useSelector((state: RootState) => state.cart);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    if (!isHydrated) {
      dispatch(hydrateCart());
    }
  }, [dispatch, isHydrated]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      dispatch(addToCart({ product, quantity }));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: number) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const setQuantity = useCallback(
    (productId: number, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }));
    },
    [dispatch]
  );

  const increment = useCallback(
    (productId: number) => {
      dispatch(incrementQuantity(productId));
    },
    [dispatch]
  );

  const decrement = useCallback(
    (productId: number) => {
      dispatch(decrementQuantity(productId));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const isInCart = useCallback(
    (productId: number): boolean => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: number): number => {
      const item = items.find((item) => item.product.id === productId);
      return item?.quantity ?? 0;
    },
    [items]
  );

  return {
    items,
    totalItems,
    totalPrice,
    isHydrated,
    addItem,
    removeItem,
    setQuantity,
    increment,
    decrement,
    clear,
    isInCart,
    getItemQuantity,
  };
};
