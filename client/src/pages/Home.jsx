// Home.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/slices/postSlice';
import { addLike } from '../redux/slices/likeSlice';
import PostForm from '../components/PostForm';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleString('en-US', options).replace(',', ' at');
};

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.data);
  const loading = useSelector((state) => state.posts.loading);
  const userId = useSelector((state) => state.user.user?.id); // Safely access user ID

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    if (userId) {
      dispatch(addLike({ userId, postId })); 
    }
  };

  return (
    <div className="page">
      <h1>Home Page</h1>
      <p>Welcome back to the social network!</p>
      {userId && <PostForm />}
      <div className="posts-list">
        {loading && posts.length === 0 ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <p><b>{post.name}</b><br/>
              <small>{formatDate(post.created_at)}</small></p>
              
              <p>{post.content}</p>
              <button onClick={() => handleLike(post.id)}>Like</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
