"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  WISHLIST_STORAGE_KEY,
  getCartCount,
  getCartLineKey,
  getCartSubtotal,
  parseCartLineKey,
  type CartItem,
} from "@/lib/cart";
import { getProductById } from "@/lib/products";

type CartContextValue = {
  ready: boolean;
  items: CartItem[];
  wishlist: string[];
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  addToCart: (productId: string, size: string, quantity?: number) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  updateSize: (lineKey: string, size: string) => void;
  removeFromCart: (lineKey: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setItems(readStorage<CartItem[]>(CART_STORAGE_KEY, []));
    setWishlist(readStorage<string[]>(WISHLIST_STORAGE_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStorage(CART_STORAGE_KEY, items);
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    writeStorage(WISHLIST_STORAGE_KEY, wishlist);
  }, [wishlist, ready]);

  const addToCart = useCallback(
    (productId: string, size: string, quantity = 1) => {
      const product = getProductById(productId);
      if (!product) return;

      const safeSize = product.sizes.some((entry) => entry.label === size)
        ? size
        : (product.sizes.find((entry) => entry.label === "M")?.label ??
          product.sizes[0]?.label ??
          size);

      setItems((current) => {
        const lineKey = getCartLineKey(productId, safeSize);
        const existing = current.find(
          (item) => getCartLineKey(item.productId, item.size) === lineKey,
        );

        if (existing) {
          return current.map((item) =>
            getCartLineKey(item.productId, item.size) === lineKey
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        return [...current, { productId, size: safeSize, quantity }];
      });
    },
    [],
  );

  const updateQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) =>
        current.filter(
          (item) => getCartLineKey(item.productId, item.size) !== lineKey,
        ),
      );
      return;
    }

    setItems((current) =>
      current.map((item) =>
        getCartLineKey(item.productId, item.size) === lineKey
          ? { ...item, quantity }
          : item,
      ),
    );
  }, []);

  const updateSize = useCallback((lineKey: string, size: string) => {
    setItems((current) => {
      const item = current.find(
        (entry) => getCartLineKey(entry.productId, entry.size) === lineKey,
      );
      if (!item) return current;

      const nextKey = getCartLineKey(item.productId, size);
      const withoutCurrent = current.filter(
        (entry) => getCartLineKey(entry.productId, entry.size) !== lineKey,
      );
      const existing = withoutCurrent.find(
        (entry) => getCartLineKey(entry.productId, entry.size) === nextKey,
      );

      if (existing) {
        return withoutCurrent.map((entry) =>
          getCartLineKey(entry.productId, entry.size) === nextKey
            ? { ...entry, quantity: entry.quantity + item.quantity }
            : entry,
        );
      }

      return [
        ...withoutCurrent,
        { productId: item.productId, size, quantity: item.quantity },
      ];
    });
  }, []);

  const removeFromCart = useCallback((lineKey: string) => {
    setItems((current) =>
      current.filter(
        (item) => getCartLineKey(item.productId, item.size) !== lineKey,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((current) => current.filter((id) => id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const subtotal = useMemo(
    () =>
      getCartSubtotal(items, (productId) => getProductById(productId)?.price),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ready,
      items,
      wishlist,
      cartCount: getCartCount(items),
      wishlistCount: wishlist.length,
      subtotal,
      addToCart,
      updateQuantity,
      updateSize,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
    }),
    [
      ready,
      items,
      wishlist,
      subtotal,
      addToCart,
      updateQuantity,
      updateSize,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export { getCartLineKey, parseCartLineKey };
