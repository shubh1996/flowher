import { create } from 'zustand';
import type { CartState, CartItem } from '../types/product';

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addItem: (item) => {
        const totalPrice =
            item.product.basePrice * item.quantity +
            (item.selectedQuantity?.priceModifier || 0) +
            item.selectedCombos.reduce((sum, combo) => sum + combo.price, 0);

        const newItem: CartItem = { ...item, totalPrice };

        set((state) => {
            const existingItemIndex = state.items.findIndex(
                (i) => i.product.id === item.product.id
            );

            if (existingItemIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + item.quantity,
                    totalPrice: updatedItems[existingItemIndex].totalPrice + totalPrice,
                };
                return { items: updatedItems };
            }

            return { items: [...state.items, newItem] };
        });
    },

    removeItem: (productId) => {
        set((state) => ({
            items: state.items.filter((item) => item.product.id !== productId),
        }));
    },

    updateQuantity: (productId, quantity) => {
        set((state) => ({
            items: state.items.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity }
                    : item
            ),
        }));
    },

    clearCart: () => set({ items: [] }),

    getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },
}));
