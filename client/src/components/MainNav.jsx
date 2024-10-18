import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LoggedUserBlock from './LoggedUserBlock';
import { addNotification, getRecentNotifications } from '../redux/slices/notificationSlice';
import { resetNotificationAlert } from '../redux/slices/userSlice';
import { io } from 'socket.io-client';
import SegmentIcon from '@mui/icons-material/Segment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsMenuBlock from './NotificationsMenuBlock';

const MainNav = () => {
    const user = useSelector(state => state.user.user);
    const notification_alert = useSelector(state => state.user.user?.notification_alert);
    const notifications = useSelector(state => state.notifications.notifications);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const newSocket = io('http://127.0.0.1:3001');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            if (user?.id) {
                newSocket.emit('join', { userId: user.id });
            }
        });

        newSocket.on('new_notification', (data) => {
            if (data.author_id === user?.id) {
                setNotificationCount(prevCount => prevCount + 1);
                dispatch(addNotification({
                    id: Date.now(),
                    message: data.message || 'Your post was liked!',
                    is_read: false
                }));
                dispatch({ type: 'user/notificationAlertTrue' });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [dispatch, user]);

    const handleNotificationClick = () => {
        setIsMenuOpen(!isMenuOpen);

        if (!isMenuOpen && user?.id) {
            dispatch(getRecentNotifications());
            dispatch(resetNotificationAlert(user.id));
        }
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
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
                    {notification_alert === true &&(
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
                    {isMenuOpen && (
                        <NotificationsMenuBlock
                            notifications={notifications}
                            onClose={handleMenuClose}
                        />
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;
