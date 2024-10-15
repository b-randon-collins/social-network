// src/components/PostForm.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/slices/postSlice';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user?.id);
  const loading = useSelector((state) => state.posts.loading);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User not logged in.');
      return;
    }

    const postData = {
      content,
      user_id: userId,
    };

    dispatch(createPost(postData))
      .unwrap()
      .then(() => {
        setContent('');
        setError(null);
      })
      .catch((err) => {
        setError('Failed to create post.');
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Create Post'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PostForm;
