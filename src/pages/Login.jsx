import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from '../redux/user/userSlice';
import api from '../services/axiosConfig'; // Import axios instance

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' }); // Khởi tạo với email và password
    const { loading, error } = useSelector((state) => state.user); // Lấy trạng thái từ Redux

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value }); // Cập nhật giá trị trong formData
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form
        dispatch(signInStart()); // Bắt đầu quá trình đăng nhập

        try {
            // Gọi API để đăng nhập bằng axios
            const res = await api.post('http://localhost:4000/api/auth/login', formData); // chú ý đường dẫn từ backend 
            const data = res.data; // Lấy dữ liệu từ phản hồi

            // Kiểm tra phản hồi từ server
            if (data.success === false) {
                dispatch(signInFailure({ message: data.message || 'Invalid credentials.' })); // Thông báo lỗi
                return;
            }

            // Gọi action thành công và điều hướng
            dispatch(signInSuccess(data)); // Lưu thông tin người dùng vào Redux
            
            // Lưu Access Token vào Local Storage
            localStorage.setItem('accessToken', data.accessToken); // Lưu Access Token trong Local Storage

            // Không cần làm gì với Refresh Token ở frontend vì nó đã được lưu trong HttpOnly Cookie
            
            navigate('/dashboard'); // Điều hướng đến trang chính sau khi đăng nhập thành công
        } catch (error) {
            dispatch(signInFailure({ message: 'Login failed. Please try again.' })); // Thông báo lỗi trong trường hợp ngoại lệ
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Login</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>   
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
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Don't Have an account?</p>
                <Link to='/register'>
                    <span className='text-blue-500'>Register</span>
                </Link>
            </div>
            <p className='text-red-700 mt-5'>
                {error ? error.message || 'Something went wrong!' : ''}
            </p>
        </div>
    );
}
