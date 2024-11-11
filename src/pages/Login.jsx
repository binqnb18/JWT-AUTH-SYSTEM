import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { loginUser } from '../services/userService';
import { scheduleTokenRefresh } from '../Configs/axiosConfig'; // Import hàm làm mới định kỳ

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());

        try {
            const data = await loginUser(formData);

            if (data.success === false) {
                dispatch(signInFailure({ message: data.message || 'Invalid credentials.' }));
                return;
            }

            localStorage.setItem('accessToken', data.accessToken);
            console.log("Access Token saved to localStorage:", data.accessToken);

            dispatch(signInSuccess(data));
            scheduleTokenRefresh(data.accessToken); // Bắt đầu làm mới token sau khi đăng nhập thành công
            navigate('/dashboard');
        } catch (error) {
            dispatch(signInFailure({ message: error.message || 'Login failed. Please try again.' }));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    className="bg-slate-100 p-3 rounded-lg"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    className="bg-slate-100 p-3 rounded-lg"
                    onChange={handleChange}
                    required
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
            </form>
            <div className="flex gap-2 mt-5">
                <p>Don't Have an account?</p>
                <Link to="/register">
                    <span className="text-blue-500">Register</span>
                </Link>
            </div>
            <p className="text-red-700 mt-5">
                {error ? error.message || 'Something went wrong!' : ''}
            </p>
        </div>
    );
}
