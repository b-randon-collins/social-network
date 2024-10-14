import React from 'react';
import { Link } from 'react-router-dom';
import LoggedUserBlock from './LoggedUserBlock';

const MainNav = () => {
    return (
        <nav id='main-nav'>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/">Welcome</Link>
                </li>
                <li style={{"float":"right"}}>
                <LoggedUserBlock />
                </li>
            </ul>
          
        </nav>
    );
};

export default MainNav;
