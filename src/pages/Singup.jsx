import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/axiosConfig'; // Import Axios instance

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await api.post('/api/auth/signup', formData); // Gửi yêu cầu đăng ký đến đúng endpoint
            if (res.data.success) {
                alert('User registered successfully!');
                navigate('/sign-in'); // Điều hướng đến trang đăng nhập
            }
        } catch (error) {
            setError(true);
            console.error('Error during signup:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input
                    type='text'
                    placeholder='Username'
                    id='username'
                    className='bg-slate-100 p-3 rounded-lg'
                    onChange={handleChange}
                    required
                />
                <input
                    type='email'
                    placeholder='Email'
                    id='email'
                    className='bg-slate-100 p-3 rounded-lg'
                    onChange={handleChange}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    id='password'
                    className='bg-slate-100 p-3 rounded-lg'
                    onChange={handleChange}
                    required
                />
                <button
                    disabled={loading}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <div className='flex gap-2 mt-5'>
                    <p>Have an account?</p>
                    <Link to='/sign-in'>
                        <span className='text-blue-500'>Sign in</span>
                    </Link>
                </div>
                <p className='text-red-700 mt-5'>
                    {error && 'Something went wrong!'} {/* Hiển thị thông báo lỗi nếu có */}
                </p>
            </form>
        </div>
    );
};

export default SignUp;
