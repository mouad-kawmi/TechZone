import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api.js';

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => api.getSettings());
export const saveSettingsToBackend = createAsyncThunk('settings/saveSettingsToBackend', async (settings) => api.updateSettings(settings));

const initialState = {
    name: 'TechZone Electro',
    storeName: 'TechZone Electro',
    email: 'contact@techzone.ma',
    phone: '+212 600 000 000',
    address: 'Twin Center, Casablanca',
    deliveryFee: 25,
    freeDeliveryThreshold: 2000,
    currency: 'MAD',
    maintenanceMode: false,
    isLoading: false,
    error: null
};

const normalizeLocalSettings = (settings = {}) => {
    const storeName = settings.name || settings.storeName || 'TechZone Electro';
    return { ...settings, name: storeName, storeName };
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSettings: (state, action) => normalizeLocalSettings({ ...state, ...action.payload })
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.fulfilled, (state, action) => ({ ...state, ...normalizeLocalSettings(action.payload), isLoading: false }))
            .addCase(saveSettingsToBackend.fulfilled, (state, action) => ({ ...state, ...normalizeLocalSettings(action.payload), isLoading: false }))
            .addMatcher(action => action.type.startsWith('settings/') && action.type.endsWith('/pending'), (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(action => action.type.startsWith('settings/') && action.type.endsWith('/rejected'), (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
