// src/pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../services/userService'; // Import hàm gọi API

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData(); // Gọi API bảo vệ
                setUser(data); // Cập nhật dữ liệu người dùng
            } catch (err) {
                setError('Failed to fetch user data.'); // Cập nhật thông báo lỗi
            }
        };

        getUserData(); // Gọi hàm để lấy dữ liệu người dùng
    }, []); // Chỉ gọi một lần khi component được mount

    return (
        <div>
            <h2>User Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <div>
                    <p>Name: {user.user.name}</p>
                    <p>Message: {user.message}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
