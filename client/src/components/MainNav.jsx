import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoggedUserBlock from './LoggedUserBlock';

const MainNav = () => {
    const user = useSelector(state => state.user.user);

    return (
        <nav id='main-nav'>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {!user && (
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                )}
                <li style={{"float":"right"}}>
                    <LoggedUserBlock />
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;
