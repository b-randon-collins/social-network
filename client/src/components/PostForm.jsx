import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const PostForm = () => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const userId = useSelector((state) => state.user.user?.id);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError('User not logged in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, user_id: userId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessage(data.message);
            setContent('');
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to create post.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    required
                />
                <button type="submit">Create Post</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default PostForm;
