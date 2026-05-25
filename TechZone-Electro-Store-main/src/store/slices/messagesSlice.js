import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

export const fetchMessages = createAsyncThunk("messages/fetchMessages", async () => api.getMessages());
export const markMessageAsReadBackend = createAsyncThunk("messages/markMessageAsReadBackend", async (id) => api.updateMessageStatus(id, "READ"));
export const deleteMessageBackend = createAsyncThunk("messages/deleteMessageBackend", async (id) => {
    await api.deleteMessage(id);
    return id;
});

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        items: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setMessages: (state, action) => {
            state.items = action.payload || [];
        },
        addMessage: (state, action) => {
            state.items.unshift({
                id: Date.now(),
                ...action.payload,
                date: new Date().toISOString(),
                read: false
            });
        },
        markAsRead: (state, action) => {
            const message = state.items.find(m => m.id === action.payload);
            if (message) message.read = true;
        },
        deleteMessage: (state, action) => {
            state.items = state.items.filter(m => m.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(markMessageAsReadBackend.fulfilled, (state, action) => {
                const index = state.items.findIndex(m => m.id === action.payload.id);
                if (index >= 0) state.items[index] = action.payload;
            })
            .addCase(deleteMessageBackend.fulfilled, (state, action) => {
                state.items = state.items.filter(m => m.id !== action.payload);
            });
    }
});

export const { setMessages, addMessage, markAsRead, deleteMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
