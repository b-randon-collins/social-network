// src/redux/slices/userSlice.jsx

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const resetNotificationAlert = createAsyncThunk(
    'user/resetNotificationAlert',
    async (userId) => {
        const response = await axios.patch('http://127.0.0.1:3001/user/notification_alert_reset', { user_id: userId }, {
            withCredentials: true,
        });
        return response.data;
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData) => {
        const response = await axios.post('http://127.0.0.1:3001/user/signup', userData);
        return response.data;
    }
);

export const attemptLogin = createAsyncThunk(
    'user/login',
    async ({ credentials, socket }) => {
        const response = await axios.post('http://127.0.0.1:3001/user/login', credentials, {
            withCredentials: true,
        });
        
        if (socket) {
            socket.emit('join', { userId: response.data.id });
        }

        return response.data;
    }
);

export const attemptAutoLogin = createAsyncThunk(
    'user/autoLogin',
    async () => {
      const response = await axios.get('http://127.0.0.1:3001/check-auth', {
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
      authChecked: false,
    },
    reducers: {
      logout: (state) => {
        state.user = null;
      },
        notificationAlertTrue: (state) => {
            if (state.user) {
                state.user.notification_alert = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(attemptAutoLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.authChecked = false;
            })
            .addCase(attemptAutoLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.authChecked = true;
            })
            .addCase(attemptAutoLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.authChecked = true;
            })
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
            })
            .addCase(resetNotificationAlert.fulfilled, (state) => {
                if (state.user) {
                    state.user.notification_alert = 0;
                }
            });


    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
