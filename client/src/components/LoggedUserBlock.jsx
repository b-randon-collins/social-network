import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoggedUserBlock = () => {
    const userId = Cookies.get('user_id');
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
            {userId ? (
                <>
                    <span style={{"paddingRight":"10px"}}>User: {userId}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={handleLoginClick}>Login</button>
            )}
        </div>
    );
};

export default LoggedUserBlock;
