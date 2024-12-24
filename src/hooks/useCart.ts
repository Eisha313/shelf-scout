import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
} from '../store/cartSlice';
import { Product } from '../types/product';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, isHydrated } = useSelector((state: RootState) => state.cart);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    if (!isHydrated) {
      dispatch(hydrateCart());
    }
  }, [dispatch, isHydrated]);

  const addItem = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (productId: string) => {
      dispatch(removeFromCart(productId));
    },
    [dispatch]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch(updateQuantity({ productId, quantity }));
    },
    [dispatch]
  );

  const incrementQuantity = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product.id === productId);
      if (item) {
        dispatch(updateQuantity({ productId, quantity: item.quantity + 1 }));
      }
    },
    [dispatch, items]
  );

  const decrementQuantity = useCallback(
    (productId: string) => {
      const item = items.find((item) => item.product.id === productId);
      if (item) {
        dispatch(updateQuantity({ productId, quantity: item.quantity - 1 }));
      }
    },
    [dispatch, items]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = items.find((item) => item.product.id === productId);
      return item?.quantity ?? 0;
    },
    [items]
  );

  const isInCart = useCallback(
    (productId: string): boolean => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  return {
    items,
    isHydrated,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    clear,
    getItemQuantity,
    isInCart,
  };
};
