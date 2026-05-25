import { createSlice } from "@reduxjs/toolkit";

const safeParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
};

const persist = (items) => localStorage.setItem("tz_cart", JSON.stringify(items));

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: safeParse("tz_cart", [])
    },
    reducers: {
        setCartItems: (state, action) => {
            state.items = action.payload || [];
            persist(state.items);
        },
        addToCart: (state, action) => {
            const product = action.payload;
            const existing = state.items.find(item =>
                item.id === product.id &&
                item.selectedStorage === product.selectedStorage &&
                item.selectedColor === product.selectedColor
            );
            const availableStock = Number(product.stock || 0);
            const requestedQuantity = Math.max(1, Number(product.quantity || 1));
            if (availableStock <= 0 || requestedQuantity > availableStock) {
                persist(state.items);
                return;
            }
            if (existing) {
                const nextQuantity = existing.quantity + requestedQuantity;
                if (nextQuantity <= availableStock) existing.quantity = nextQuantity;
            } else {
                state.items.push({ ...product, quantity: requestedQuantity, stock: availableStock });
            }
            persist(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload && item.cartItemId !== action.payload);
            persist(state.items);
        },
        updateQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.id || item.cartItemId === action.payload.id);
            if (item) {
                const newQuantity = action.payload.quantity ?? item.quantity + action.payload.delta;
                if (newQuantity >= 1 && (!item.stock || newQuantity <= item.stock)) item.quantity = newQuantity;
            }
            persist(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("tz_cart");
        }
    }
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
