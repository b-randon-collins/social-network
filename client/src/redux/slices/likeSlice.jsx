// likeSlice.jsx

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addLike = createAsyncThunk(
  'likes/addLike',
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/like/', { user_id: userId, post_id: postId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLike.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLike.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
