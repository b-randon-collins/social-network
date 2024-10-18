// src/redux/slices/userSlice.jsx

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData) => {
        const response = await axios.post('http://127.0.0.1:3001/user/signup', userData);
        return response.data;
    }
);

export const attemptLogin = createAsyncThunk(
    'user/login',
    async (credentials) => {
        const response = await axios.post('http://127.0.0.1:3001/user/login', credentials, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const editUser = createAsyncThunk(
    'user/edit',
    async (userData) => {
        const response = await axios.patch('http://127.0.0.1:3001/user/edit', userData, {
            withCredentials: true,
        });
        return response.data.user;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(attemptLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(attemptLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(attemptLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
