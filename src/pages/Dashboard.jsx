// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { fetchUserData } from '../services/userService'; // Import hàm gọi API

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const token = localStorage.getItem('accessToken'); // Lấy Access Token từ Local Storage
        
        // Nếu không có token, chuyển hướng đến trang login
        if (!token) {
            navigate('/login');
            return; // Ngăn không cho tiếp tục thực hiện các bước tiếp theo
        }

        const getUserData = async () => {
            try {
                const data = await fetchUserData(); // Gọi API bảo vệ
                setUser(data); // Cập nhật dữ liệu người dùng
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    // Nếu token hết hạn, điều hướng đến trang login
                    setError('Access token expired. Please log in again.');
                    navigate('/login');
                } else {
                    setError('Failed to fetch user data.'); // Cập nhật thông báo lỗi
                }
            }
        };

        getUserData(); // Gọi hàm để lấy dữ liệu người dùng
    }, [navigate]); // Chạy lại nếu navigate thay đổi

    return (
        <div className='px-4 py-12 max-w-2xl mx-auto'>
            <h1 className='text-3xl font-bold mb-4 text-slate-800'>
                Welcome to my Auth App!
            </h1>
            {error && <p className='text-red-500'>{error}</p>}
            {user ? (
                <div>
                    <p className='mb-4 text-slate-700'>Name: {user.user.name}</p>
                    <p className='mb-4 text-slate-700'>Message: {user.message}</p>
                </div>
            ) : (
                <p className='mb-4 text-slate-700'>Loading user data...</p>
            )}
            {/* Thêm nội dung khác nếu cần */}
        </div>
    );
};

export default Dashboard;
