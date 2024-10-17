// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice';
import commentReducer from './slices/commentsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
    comments: commentReducer,
  },
});

export default store;
