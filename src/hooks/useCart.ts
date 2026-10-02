import { useEffect, useState } from "react";
import {
  CART_KEY,
  MAX_QUANTITY,
  sanitizeCart,
  type CartItem,
} from "../utils/order";
import type { Size } from "../data/products";
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"));
    } catch {
      return [];
    }
  });
  const [storageIssue, setStorageIssue] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      setStorageIssue(false);
    } catch {
      setStorageIssue(true);
    }
  }, [cart]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        try {
          setCart(sanitizeCart(JSON.parse(e.newValue ?? "[]")));
        } catch {
          setCart([]);
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const add = (productId: string, size: Size, quantity: number) =>
    setCart((old) => {
      const existing = old.find(
        (i) => i.productId === productId && i.size === size,
      );
      return existing
        ? old.map((i) =>
            i === existing
              ? {
                  ...i,
                  quantity: Math.min(MAX_QUANTITY, i.quantity + quantity),
                }
              : i,
          )
        : [
            ...old,
            { productId, size, quantity: Math.min(MAX_QUANTITY, quantity) },
          ];
    });
  const update = (productId: string, size: Size, quantity: number) =>
    setCart((old) =>
      quantity <= 0
        ? old.filter((i) => i.productId !== productId || i.size !== size)
        : old.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) }
              : i,
          ),
    );
  return { cart, add, update, clear: () => setCart([]), storageIssue };
}
