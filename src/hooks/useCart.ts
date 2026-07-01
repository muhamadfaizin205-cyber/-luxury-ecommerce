"use client";

import { useState, useCallback } from "react";
import type { Product, CartItem } from "@/types";

/**
 * Local (client-side) cart hook.
 * In production, sync this with Supabase via addToCartDb().
 */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((product: Product, size?: string, color?: string) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(
        i => i.id === product.id &&
             i.selectedSize  === size &&
             i.selectedColor === color
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + 1,
        };
        return updated;
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, item) => {
    const n = parseInt(item.price.replace(/\D/g, ""), 10);
    return sum + (isNaN(n) ? 0 : n) * item.quantity;
  }, 0);

  return { items, add, remove, clear, total, count: items.length };
}
