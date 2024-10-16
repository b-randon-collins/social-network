// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const addLike = createAsyncThunk(
//   'likes/addLike',
//   async ({ userId, postId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('http://localhost:3001/like/', { user_id: userId, post_id: postId });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// export const removeLike = createAsyncThunk(
//   'likes/removeLike',
//   async ({ userId, postId }, { rejectWithValue }) => {
//     try {
//       // Add your API endpoint to unlike here
//       const response = await axios.delete(`http://localhost:3001/like/${postId}`, { data: { user_id: userId } });
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// const likeSlice = createSlice({
//   name: 'likes',
//   initialState: {
//     data: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     optimisticLike(state, action) {
//       const { postId } = action.payload;
//       const post = state.data.find(p => p.id === postId);
//       if (post) {
//         post.likes_count += 1;
//         post.liked_by_user_ids.push(action.payload.userId);
//       }
//     },
//     optimisticUnlike(state, action) {
//       const { postId } = action.payload;
//       const post = state.data.find(p => p.id === postId);
//       if (post) {
//         post.likes_count -= 1;
//         post.liked_by_user_ids = post.liked_by_user_ids.filter(id => id !== action.payload.userId);
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addLike.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addLike.fulfilled, (state, action) => {
//         state.loading = false;
//       })
//       .addCase(addLike.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(removeLike.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(removeLike.fulfilled, (state, action) => {
//         state.loading = false;
//         // Handle the fullfilled response if needed
//       })
//       .addCase(removeLike.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { optimisticLike, optimisticUnlike } = likeSlice.actions;
// export default likeSlice.reducer;
