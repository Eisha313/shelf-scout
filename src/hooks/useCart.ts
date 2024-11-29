import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartIsOpen,
  selectCartItemCount,
  selectCartTotal,
  selectIsInCart,
} from '../store/cartSlice';
import { Product, CartItem } from '../types/product';

interface UseCartReturn {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

export const useCart = (): UseCartReturn => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const isOpen = useSelector(selectCartIsOpen);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      dispatch(addToCart({ product, quantity }));
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

  const increment = useCallback(
    (productId: string) => {
      dispatch(incrementQuantity(productId));
    },
    [dispatch]
  );

  const decrement = useCallback(
    (productId: string) => {
      dispatch(decrementQuantity(productId));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const open = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some(item => item.product.id === productId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find(item => item.product.id === productId);
      return item?.quantity ?? 0;
    },
    [items]
  );

  return useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      total,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clear,
      toggle,
      open,
      close,
      isInCart,
      getItemQuantity,
    }),
    [
      items,
      isOpen,
      itemCount,
      total,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clear,
      toggle,
      open,
      close,
      isInCart,
      getItemQuantity,
    ]
  );
};

export default useCart;
