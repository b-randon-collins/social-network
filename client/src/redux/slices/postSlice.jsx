// postSlice.js

import { addInitialComments, addRecentUserComment } from './commentsSlice';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {},
  lists: {
    notifications_page: [],
  },
  status: 'idle',
  error: null,
};

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:3001/post/', postData, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/post/', { withCredentials: true });
      const { posts, comments, recent_comments } = response.data;

      dispatch(addInitialComments(comments));

      for (const postId in recent_comments) {
        dispatch(addRecentUserComment({ post_id: postId, comment: recent_comments[postId] }));
      }
      
      dispatch(setList({ listName: 'home_page', postIds: posts.map(post => post.id) }));
      return posts;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);





export const addLike = createAsyncThunk(
  'posts/addLike',
  async ({ userId, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:3001/like/', { user_id: userId, post_id: postId }, { withCredentials: true });
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
      const response = await axios.delete(`http://127.0.0.1:3001/like/${postId}`, { data: { user_id: userId }, withCredentials: true });
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
    lists: {},
    loading: false,
    error: null,
  },  reducers: {
    setData(state, action) {
      const { id, post } = action.payload;
      state.data[id] = post;
    },
    setList(state, action) {
      const { listName, postIds } = action.payload;
      state.lists[listName] = postIds;
    },
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
        const { post_id, author_id, liker_id, post_content, liker_name } = action.payload;

        const post = state.data.find(p => p.id === post_id);
        if (post) {
          post.likes_count += 1;
          post.logged_user_liked = true;

          post.author_id = author_id;
          post.post_content = post_content;
        }
      })
      .addCase(removeLike.fulfilled, (state, action) => {
        const { post_id } = action.payload;
        const post = state.data.find(p => p.id === post_id);
        if (post) {
          post.likes_count -= 1;
          post.logged_user_liked = false;
        }
      });
    },
});

export const { setData, setList, optimisticLike, optimisticUnlike } = postSlice.actions;
export default postSlice.reducer;
