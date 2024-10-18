import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/comment/${postId}`, { withCredentials: true });
      return { postId, comments: response.data.comments };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:3001/comment/', { post_id: postId, content }, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {},
  reducers: {
    addInitialComments: (state, action) => {
      action.payload.forEach(comment => {
        if (!state[comment.post_id]) {
          state[comment.post_id] = [];
        }
        if (!state[comment.post_id].some(c => c.id === comment.id)) {
          state[comment.post_id].push(comment);
        }
      });
    },
    addComment: (state, action) => {
      const { post_id } = action.payload;
      if (!state[post_id]) {
        state[post_id] = [];
      }
      if (!state[post_id].some(c => c.id === action.payload.id)) {
        state[post_id].push(action.payload);
      }
    },
    addRecentUserComment: (state, action) => {
      const { post_id, comment } = action.payload;
      if (!state[post_id]) {
        state[post_id] = [];
      }
      if (!state[post_id].some(c => c.id === comment.id)) {
        state[post_id].push(comment);
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        if (!state[postId]) {
          state[postId] = [];
        }
        comments.slice(1).forEach(comment => {
          if (!state[postId].some(c => c.id === comment.id)) {
            state[postId].push(comment);
          }
        });
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { post_id } = action.payload;
        if (!state[post_id]) {
          state[post_id] = [];
        }
        state[post_id].push(action.payload);
      });
  },
});


export const { addInitialComments, addRecentUserComment } = commentsSlice.actions;
export default commentsSlice.reducer;
