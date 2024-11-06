// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate và Link
import api from '../services/axiosConfig'; // Import Axios instance

const Login = () => {
    const [email, setEmail] = useState(''); // State cho email
    const [password, setPassword] = useState(''); // State cho password
    const [error, setError] = useState(''); // State cho thông báo lỗi
    const [loading, setLoading] = useState(false); // State cho trạng thái loading
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn chặn reload trang
        setLoading(true); // Bắt đầu loading
        try {
            const response = await api.post('/login', { email, password }); // Gửi yêu cầu login với email và password
            console.log('Login response:', response.data); // Ghi log phản hồi từ API

            // Lưu Access Token vào localStorage
            localStorage.setItem('accessToken', response.data.accessToken); 

            // Kiểm tra cookie nếu cần
            console.log('Cookies:', document.cookie); // Ghi log cookie hiện tại

            alert('Login successful!'); // Thông báo thành công

            // Điều hướng đến trang profile
            navigate('/profile'); // Điều hướng đến trang người dùng
        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message); // Ghi log lỗi từ phản hồi
            setError('Login failed!'); // Cập nhật thông báo lỗi
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h2 className='text-center'>Login</h2>
            <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                <input
                    type="email"
                    placeholder='Email'
                    className='bg-slate-100 p-3 rounded-lg'
                    onChange={(e) => setEmail(e.target.value)} // Cập nhật state email
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    className='bg-slate-100 p-3 rounded-lg'
                    onChange={(e) => setPassword(e.target.value)} // Cập nhật state password
                    required
                />
                <button 
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Loading...' : 'Sign In'} {/* Hiển thị trạng thái button */}
                </button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Don't Have an account?</p>
                <Link to='/sign-up'> 
                    <span className='text-blue-500'>Sign up</span>
                </Link>   
            </div>
            <p className='text-red-700 mt-5'>
                {error || 'Something went wrong!'} {/* Hiển thị thông báo lỗi nếu có */}
            </p>
        </div>
    );
};

export default Login;
