import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.is_read).length;
    },
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
});

export const { setNotifications, markAsRead, clearNotifications, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
