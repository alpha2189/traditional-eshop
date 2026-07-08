'use client';

// Καλάθι με Zustand + persist (localStorage) — επιβιώνει σε refresh/επιστροφή.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from '@/lib/types';

interface CartState {
  lines: CartLine[];
  isOpen: boolean; // slide-over drawer (Φάση 3)
  addLine: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      addLine: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.variantId === line.variantId,
          );
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              existing.maxStock,
            );
            return {
              lines: state.lines.map((l) =>
                l.variantId === line.variantId ? { ...l, quantity: nextQty } : l,
              ),
              isOpen: true,
            };
          }
          return {
            lines: [
              ...state.lines,
              { ...line, quantity: Math.min(quantity, line.maxStock) },
            ],
            isOpen: true,
          };
        }),

      setQuantity: (variantId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.variantId !== variantId)
              : state.lines.map((l) =>
                  l.variantId === variantId
                    ? { ...l, quantity: Math.min(quantity, l.maxStock) }
                    : l,
                ),
        })),

      removeLine: (variantId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.variantId !== variantId),
        })),

      clear: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'traditional-cart',
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export const selectTotalQuantity = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.quantity, 0);

export const selectSubtotalCents = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
