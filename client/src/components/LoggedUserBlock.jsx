import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const LoggedUserBlock = () => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        const response = await fetch('http://localhost:3001/user/logout', {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            window.location.reload();
        } else {
            navigate('/welcome');
        }
    };

    return (
        <div id='logged-user-block'>

            {user ? (
                <>
            <Link to="/profile">{user.name}</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={handleLoginClick}>Login</button>
            )}
        </div>
    );
};

export default LoggedUserBlock;
