import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllNotifications, clearNotifications } from '../redux/slices/notificationSlice';
import { setData, setList } from '../redux/slices/postSlice';

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const [localNotifications, setLocalNotifications] = useState([]);

    const reduxListName = "notificationsPageAll";

    useEffect(() => {
        const loadNotifications = async () => {
            const action = await dispatch(fetchAllNotifications(reduxListName));
            if (fetchAllNotifications.fulfilled.match(action)) {
                const notifications = action.payload.data;
                setLocalNotifications(notifications);

                const postIds = [];
                notifications.forEach(notification => {
                    const post = {
                        id: notification.post_id,
                        content: notification.post_content,
                        created_at: notification.created_at,
                        username: notification.username,
                        is_read: notification.is_read
                    };

                    dispatch(setData({ id: post.id, post }));
                    postIds.push(post.id);
                });

                dispatch(setList({ listName: reduxListName, postIds }));
            }
        };

        loadNotifications();
    }, [dispatch, reduxListName]);

    const handleClearNotifications = async () => {
        const action = await dispatch(clearNotifications());
        if (clearNotifications.fulfilled.match(action)) {
            setLocalNotifications([]);
        }
    };

    return (
        <div className='page activities-page'>
            <h2>Notifications</h2>
            <button onClick={handleClearNotifications}>Clear All</button>
            <ul>
                {localNotifications.length > 0 ? (
                    localNotifications.map(notification => (
                        <li key={notification.id}>
                            <p>
                                <strong>{notification.username}</strong> - {notification.created_at}
                            </p>
                            <p>{notification.post_content}</p>
                            <p>{notification.is_read ? 'Read' : 'Unread'}</p>
                        </li>
                    ))
                ) : (
                    <p>No notifications available.</p>
                )}
            </ul>
        </div>
    );
};

export default NotificationsPage;
