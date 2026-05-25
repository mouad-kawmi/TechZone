import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (user) => api.getOrders(user));
export const updateOrderStatusBackend = createAsyncThunk("orders/updateOrderStatusBackend", async ({ order, status }) => {
    return api.updateOrderStatus(order, status);
});

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        allOrders: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setOrders: (state, action) => {
            state.allOrders = action.payload || [];
        },
        addOrder: (state, action) => {
            state.allOrders.unshift(action.payload);
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const order = state.allOrders.find(o => o.id === id || o.backendId === id);
            if (order) status && (order.status = status);
        },
        clearOrders: (state) => {
            state.allOrders = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allOrders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(updateOrderStatusBackend.fulfilled, (state, action) => {
                const index = state.allOrders.findIndex(o => o.backendId === action.payload.backendId || o.id === action.payload.id);
                if (index >= 0) state.allOrders[index] = action.payload;
            });
    }
});

export const { setOrders, addOrder, updateOrderStatus, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
