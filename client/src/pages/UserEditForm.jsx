import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser } from '../redux/slices/userSlice';

const UserEditForm = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio || '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editUser({ name, email, bio }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Bio:</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <button type="submit">Save Changes</button>
        </form>
    );
};

export default UserEditForm;
