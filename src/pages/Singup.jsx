// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate và Link
import api from '../services/axiosConfig'; // Import Axios instance

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    }); // State cho các trường dữ liệu
    const [error, setError] = useState(''); // State cho thông báo lỗi
    const [loading, setLoading] = useState(false); // State cho trạng thái loading
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value }); // Cập nhật state formData
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn reload trang
        setLoading(true); // Bắt đầu loading
        try {
            const response = await api.post('/api/auth/signup', formData); // Gửi yêu cầu đăng ký
            console.log('Sign Up response:', response.data); // Ghi log phản hồi từ API

            if (response.data.success === false) { // Kiểm tra phản hồi từ API
                setError('Sign up failed!'); // Cập nhật thông báo lỗi
                return;
            }

            alert('Sign up successful!'); // Thông báo thành công
            navigate('/sign-in'); // Điều hướng đến trang đăng nhập
        } catch (err) {
            console.error('Sign Up error:', err.response ? err.response.data : err.message); // Ghi log lỗi từ phản hồi
            setError('Something went wrong!'); // Cập nhật thông báo lỗi
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h2 className='text-center'>Sign Up</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    type='text'
                    placeholder='Username'
                    id='username'   
                    className='bg-slate-100 p-3 rounded-lg'
                    value={formData.username} // Thiết lập giá trị từ formData
                    onChange={handleChange} // Gọi handleChange để cập nhật state
                    required
                />
                <input
                    type='email'
                    placeholder='Email'
                    id='email'
                    className='bg-slate-100 p-3 rounded-lg'
                    value={formData.email} // Thiết lập giá trị từ formData
                    onChange={handleChange} // Gọi handleChange để cập nhật state
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    id='password'
                    className='bg-slate-100 p-3 rounded-lg'
                    value={formData.password} // Thiết lập giá trị từ formData
                    onChange={handleChange} // Gọi handleChange để cập nhật state
                    required
                />
                <button 
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Loading...' : 'Sign Up'} {/* Hiển thị trạng thái button */}
                </button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Already have an account?</p>
                <Link to='/sign-in'> 
                    <span className='text-blue-500'>Sign In</span>
                </Link>   
            </div>
            <p className='text-red-700 mt-5'>
                {error} {/* Hiển thị thông báo lỗi nếu có */}
            </p>
        </div>
    );
};

export default SignUp;
