// postSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/post/', postData, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3001/post/', { withCredentials: true });
      return response.data.all_posts;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addLike = createAsyncThunk(
  'posts/addLike',
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/like/', { user_id: userId, post_id: postId }, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeLike = createAsyncThunk(
  'posts/removeLike',
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:3001/like/${postId}`, { data: { user_id: userId }, withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    optimisticLike(state, action) {
      const { postId } = action.payload;
      const post = state.data.find(p => p.id === postId);
      if (post) {
        post.likes_count += 1;
        post.logged_user_liked = true;
      }
    },
    optimisticUnlike(state, action) {
      const { postId } = action.payload;
      const post = state.data.find(p => p.id === postId);
      if (post) {
        post.likes_count -= 1;
        post.logged_user_liked = false;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLike.fulfilled, (state, action) => {
      })
      .addCase(removeLike.fulfilled, (state, action) => {
      });
  },
});

export const { optimisticLike, optimisticUnlike } = postSlice.actions;
export default postSlice.reducer;
