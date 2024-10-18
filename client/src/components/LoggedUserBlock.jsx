import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LoggedUserBlock = () => {
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        const response = await fetch('http://127.0.0.1:3001/user/logout', {
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
                <>
                    <Link to="/register">
                        <button style={{ backgroundColor: isRegisterPage ? 'dodgerBlue' : 'transparent', color: isRegisterPage ? 'white' : 'dodgerBlue' }}>
                            Register
                        </button>
                    </Link>
                    <button onClick={handleLoginClick} style={{ backgroundColor: isLoginPage ? 'dodgerBlue' : 'transparent', color: isLoginPage ? 'white' : 'dodgerBlue' }}>
                        Login
                    </button>
                </>
            )}
        </div>
    );
};

export default LoggedUserBlock;
