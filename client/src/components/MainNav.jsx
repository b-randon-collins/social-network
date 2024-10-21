import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LoggedUserBlock from './LoggedUserBlock';
import { addNotification } from '../redux/slices/notificationSlice';
import { io } from 'socket.io-client';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsMenuBlock from './NotificationsMenuBlock';
import { getRecentNotifications } from '../redux/slices/notificationSlice';

const MainNav = () => {
    const user = useSelector(state => state.user.user);
    const notifications = useSelector(state => state.notifications.data);
    const notificationAlert = useSelector(state => state.user.user?.notification_alert);
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const navigate = useNavigate();

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

        if (isMenuOpen && user?.id) {
            dispatch(getRecentNotifications("notificationsMenuBlockRecent"));
        }
    };

    return (
        <nav id='main-nav'>
            <ul>
                <li>
                    <Link to="/"><h3>Brandon: LFW</h3></Link>
                </li>
                {!user && (
                    <li>
                        {/* Additional links for unauthenticated users can go here */}
                    </li>
                )}
                <li style={{ float: "right" }}>
                    <LoggedUserBlock />
                </li>
                {user && (
                    <>
                        <li style={{ float: "right", padding: "10px", position: 'relative' }} onClick={handleNotificationClick}>
                            <NotificationsIcon />
                            {notificationAlert && (
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
                                    onClose={() => setIsMenuOpen(false)}
                                    isMenuOpen={isMenuOpen}
                                />
                            )}
                        </li>
                        <li>
                            <Link to="/activities">Activities</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default MainNav;
