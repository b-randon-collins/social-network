import React from 'react';
import { useSelector } from 'react-redux';

const NotificationsMenuBlock = ({ onClose }) => {
    const notifications = useSelector(state => state.notifications.notifications);

    const createMessage = (notification) => {
        const date = new Date(notification.created_at).toLocaleDateString(); // Format date as needed
        return `${notification.username} liked your post.`;
    };

    return (
        <div className="notifications-menu">
            <h3>Recent Notifications</h3>
            {notifications.length > 0 ? (
                <table>
                    <tbody>
                        {notifications.map(notification => (
                            <tr key={notification.id}>
                                <td>{createMessage(notification)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No recent notifications.</p>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default NotificationsMenuBlock;
