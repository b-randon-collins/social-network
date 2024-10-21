import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    data: {},
    lists: {},
    unreadCount: 0,
};

export const fetchAllNotifications = createAsyncThunk(
    'notifications/fetchAllNotifications',
    async (listName) => {
        const response = await axios.get('http://127.0.0.1:3001/notifications/all', {
            withCredentials: true,
        });
        return { data: response.data, listName };
    }
);

export const getRecentNotifications = createAsyncThunk(
  'notifications/getRecentNotifications',
  async (listName) => {
      const response = await axios.get('http://127.0.0.1:3001/notifications/recent', {
          withCredentials: true,
      });
      return { data: response.data, listName };
  }
);

export const clearNotifications = createAsyncThunk(
    'notifications/clearNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.delete('http://127.0.0.1:3001/notifications/clear', {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action) {
            const notification = action.payload;
            state.data[notification.id] = notification;

            if (!notification.is_read) {
                state.unreadCount += 1;
            }
        },
        markAsRead(state, action) {
            const notificationId = action.payload;
            if (state.data[notificationId]) {
                state.data[notificationId].is_read = true;
                state.unreadCount -= 1;
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllNotifications.fulfilled, (state, action) => {
                const notifications = action.payload.data;
                const listName = action.payload.listName;

                notifications.forEach(notification => {
                    state.data[notification.id] = notification;
                });

                state.lists[listName] = notifications.map(n => n.id);
            })
            .addCase(getRecentNotifications.fulfilled, (state, action) => {
                const notifications = action.payload.data;
                const listName = action.payload.listName;

                state.lists[listName] = notifications.map(n => n.id);

                notifications.forEach(notification => {
                    if (!state.data[notification.id]) {
                        state.data[notification.id] = notification;
                    }
                });
          });
    },
});

export const { addNotification, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
