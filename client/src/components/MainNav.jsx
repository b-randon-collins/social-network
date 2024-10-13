// src/components/MainNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MainNav = () => {
    return (
        <nav>
            <Link to="/register">Register</Link>
        </nav>
    );
};

export default MainNav;
