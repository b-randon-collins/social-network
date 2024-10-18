// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice';
import commentReducer from './slices/commentsSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
    comments: commentReducer,
    notifications: notificationReducer,

  },
});

export default store;
