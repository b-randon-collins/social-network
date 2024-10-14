// src/MainNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MainNav = () => {
  return (
    <nav id='main-nav'>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
              <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/">Welcome</Link>
        </li>

      </ul>
    </nav>
  );
};

export default MainNav;
