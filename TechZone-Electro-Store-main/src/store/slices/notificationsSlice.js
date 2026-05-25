import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.js';

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (user) => api.getNotifications(user)
);

export const markNotificationReadBackend = createAsyncThunk(
    'notifications/markNotificationReadBackend',
    async (notification) => api.markNotificationRead(notification.backendId || notification.id)
);

const initialState = {
    notifications: JSON.parse(localStorage.getItem('tz_admin_notifications') || '[]'),
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            const newNotification = {
                id: Date.now(),
                timestamp: Date.now(),
                read: false,
                ...action.payload
            };
            state.notifications.unshift(newNotification);
            localStorage.setItem('tz_admin_notifications', JSON.stringify(state.notifications));
        },
        markNotificationRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification) {
                notification.read = true;
                localStorage.setItem('tz_admin_notifications', JSON.stringify(state.notifications));
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
            localStorage.setItem('tz_admin_notifications', JSON.stringify(state.notifications));
        },
        clearNotifications: (state) => {
            state.notifications = [];
            localStorage.removeItem('tz_admin_notifications');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload || [];
                localStorage.setItem('tz_admin_notifications', JSON.stringify(state.notifications));
            })
            .addCase(markNotificationReadBackend.fulfilled, (state, action) => {
                const notification = state.notifications.find(n =>
                    n.backendId === action.payload.backendId || n.id === action.payload.id
                );
                if (notification) {
                    notification.read = true;
                    notification.isRead = true;
                    localStorage.setItem('tz_admin_notifications', JSON.stringify(state.notifications));
                }
            });
    }
});

export const { addNotification, markNotificationRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
