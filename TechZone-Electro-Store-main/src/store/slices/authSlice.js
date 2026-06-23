import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Async logout: calls backend to revoke token cookie, then clears local state
export const performLogout = createAsyncThunk(
    'auth/performLogout',
    async (_, { dispatch }) => {
        try {
            await api.logout();
        } catch (e) {
            console.error("Logout API failed:", e);
        }
        dispatch(logout());
    }
);

const safeParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return fallback;
    }
};

const getInitialUser = () => {
    const user = safeParse("tz_user", null);
    if (user && !user.paymentMethods) {
        user.paymentMethods = [
            { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true, color: 'from-blue-600 to-indigo-700' }
        ];
    }
    return user;
};

const initialState = {
    user: getInitialUser(),
    isLoggedIn: !!safeParse("tz_user", null),
    token: null, // Token is now stored as an HttpOnly cookie — never exposed to JS
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = null; // Never store token in JS — it lives in HttpOnly cookie
            localStorage.setItem("tz_user", JSON.stringify(action.payload.user));
            localStorage.removeItem("tz_token"); // Clean up any legacy token
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.token = null;
            localStorage.removeItem("tz_user");
            localStorage.removeItem("tz_token");
        },
        registerSuccess: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = null;
            localStorage.setItem("tz_user", JSON.stringify(action.payload.user));
            localStorage.removeItem("tz_token");
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("tz_user", JSON.stringify(state.user));
        }
    }
});

export const {
    loginStart, loginSuccess, loginFailure,
    logout, registerSuccess, updateUser
} = authSlice.actions;

export default authSlice.reducer;
