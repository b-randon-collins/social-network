import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNotifications } from '../redux/slices/notificationSlice';

const Activities = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.notifications);

    useEffect(() => {
        dispatch(fetchAllNotifications());
    }, [dispatch]);

    return (
        <div className='page activities-page'>
            <h2>Activities</h2>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <li key={notification.id}>
                            <p>
                                <strong>{notification.username}</strong> - {notification.created_at}
                            </p>
                            <p>{notification.post_content}</p>
                        </li>
                    ))
                ) : (
                    <p>No notifications available.</p>
                )}
            </ul>
        </div>
    );
}

export default Activities;
