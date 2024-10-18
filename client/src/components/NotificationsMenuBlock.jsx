import React from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

const NotificationsMenuBlock = ({ onClose }) => {
    const notifications = useSelector(state => state.notifications.notifications);

    const createMessage = (notification) => {
        const date = new Date(notification.created_at).toLocaleDateString();
        return `${notification.username} liked your post.`;
    };

    return (
        <div className="notifications-menu">
            <h3>Activities</h3>
            <button onClick={onClose}><CloseIcon /></button>
            {notifications.length > 0 ? (
                <ul>
                 
                        {notifications.map(notification => (
                            <li>
                                <ul>
                                    <li key={notification.id}>
                                    {createMessage(notification)}
                                    </li>
                                    <li>
                                        {notification.post_content}
                                    </li>
                                </ul>
                            </li>
                        ))}
                  
                </ul>
            ) : (
                <p>No recent notifications.</p>
            )}
            
        </div>
    );
};

export default NotificationsMenuBlock;
