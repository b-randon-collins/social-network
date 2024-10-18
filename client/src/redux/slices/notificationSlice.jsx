import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  notifications: [],
  unreadCount: 0,
};

export const fetchAllNotifications = createAsyncThunk('notifications/fetchAllNotifications', async () => {
  const response = await axios.get('http://127.0.0.1:3001/notifications/all', {
    withCredentials: true,
  });
  return response.data;
});

export const getRecentNotifications = createAsyncThunk('notifications/getRecentNotifications', async () => {
  const response = await axios.get('http://127.0.0.1:3001/notifications/recent', {
    withCredentials: true,
  });
  return response.data;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead(state, action) {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
        state.unreadCount -= 1;
      }
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      })
      .addCase(getRecentNotifications.fulfilled, (state, action) => {
        console.log("Recent Notifications Fetched:", action.payload); // Debugging line
        state.notifications = action.payload.map(notification => ({
          ...notification,
          name: notification.name,
        }));
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      });

  },
});

export const { markAsRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
