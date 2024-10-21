import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecentNotifications } from '../redux/slices/notificationSlice';
import CloseIcon from '@mui/icons-material/Close';

const NotificationsMenuBlock = ({ onClose, isMenuOpen }) => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.data);
    const notificationIds = useSelector(state => state.notifications.lists.notificationsMenuBlockRecent);
    const loading = useSelector(state => state.notifications.loading);
    const reduxListName = "notificationsMenuBlockRecent";

    useEffect(() => {
        if (isMenuOpen) {
            dispatch(getRecentNotifications(reduxListName));
        }
    }, [dispatch, isMenuOpen, reduxListName]);

    const createMessage = (notification) => {
        const date = new Date(notification.created_at).toLocaleDateString();
        return `${notification.username} liked your post on ${date}.`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="notifications-menu">
            <span>Alerts</span>
            <button onClick={onClose}><CloseIcon /></button>
            {notificationIds && notificationIds.length > 0 ? (
                <ul>
                    {notificationIds.map(id => {
                        const notification = notifications[id];
                        return (
                            <li key={id}>
                                <ul>
                                    <li>
                                        {createMessage(notification)}
                                    </li>
                                    <li>
                                        {notification.post_content}
                                    </li>
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No recent alerts.</p>
            )}
        </div>
    );
};

export default NotificationsMenuBlock;
