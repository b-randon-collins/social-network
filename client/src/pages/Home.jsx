// src/pages/Home.jsx
import React from 'react';
import PostForm from '../components/PostForm';

const Home = () => {
  return (
    <div className='page'>
      <h1>Home Page</h1>
      <p>Welcome back to the social network!</p>
      <PostForm />
    </div>
  );
};

export default Home;
