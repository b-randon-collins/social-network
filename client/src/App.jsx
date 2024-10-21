import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { addNotification } from './redux/slices/notificationSlice';
import { attemptAutoLogin } from './redux/slices/userSlice'; 
import MainNav from './components/MainNav';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Registration from './pages/Registration';
import UserEditForm from './pages/UserEditForm';
import Activities from './pages/NotificationsPage';

const App = () => {
    const { user, authChecked } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(attemptAutoLogin());
    }, [dispatch]);

    useEffect(() => {
        const socket = io('http://127.0.0.1:3001');

        socket.on('connect', () => {
            if (user?.id) {
                socket.emit('join', { userId: user.id });
            }
        });

        socket.on('new_notification', (data) => {
            if (data.author_id === user?.id) {
                dispatch(addNotification({
                    id: Date.now(),
                    message: data.message || 'Your post was liked!',
                    is_read: false
                }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch, user]);

    if (!authChecked) {
        return null;
    }

    return (
        <Router>
            <MainNav />
            <Routes>
                <Route 
                    path="/" 
                    element={user?.id ? <Home /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/welcome" 
                    element={user?.id ? <Welcome /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/login" 
                    element={!user?.id ? <Login /> : <Navigate to="/" />} 
                />
                <Route 
                    path="/register" 
                    element={!user?.id ? <Registration /> : <Navigate to="/" />} 
                />
                <Route 
                    path="/profile" 
                    element={user?.id ? <UserEditForm /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/activities" 
                    element={user?.id ? <Activities /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;
