import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LoggedUserBlock from './LoggedUserBlock';
import { addNotification } from '../redux/slices/notificationSlice';
import { io } from 'socket.io-client';
import SegmentIcon from '@mui/icons-material/Segment';
import NotificationsIcon from '@mui/icons-material/Notifications';

const MainNav = () => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const newSocket = io('http://127.0.0.1:3001');
        setSocket(newSocket);
    
        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            if (user?.id) {
                newSocket.emit('join', { userId: user.id });
            }
        });
    
        newSocket.on('new_notification', (data) => {
            console.log('New notification received:', data);
            console.log(user)
            if (data.author_id === user?.id) {
                setNotificationCount(prevCount => prevCount + 1);
                dispatch(addNotification({
                    id: Date.now(),
                    message: data.message || 'Your post was liked!',
                    is_read: false
                }));
            }
        });
    
        return () => {
            newSocket.disconnect();
        };
    }, [dispatch, user]);
        
    const handleNotificationClick = () => {
        setNotificationCount(0);
    };

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
                <li style={{"float":"right", "padding":"10px", position: 'relative'}} onClick={handleNotificationClick}>
                    <NotificationsIcon />
                    {notificationCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'red',
                        }} />
                    )}
                </li>
                <li style={{"float":"right", "padding":"10px"}}>
                    <SegmentIcon />
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;
