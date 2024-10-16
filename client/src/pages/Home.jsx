// Home.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../redux/slices/postSlice';
import PostForm from '../components/PostForm';
import ViewPostBlock from '../components/ViewPostBlock';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.data);
  const loading = useSelector((state) => state.posts.loading);
  const userId = useSelector((state) => state.user.user?.id);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="page">
      {userId && <PostForm />}
      <div className="posts-list">
        {loading && posts.length === 0 ? (
          <></>
        ) : posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <ViewPostBlock key={post.id} post={post} userId={userId} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
