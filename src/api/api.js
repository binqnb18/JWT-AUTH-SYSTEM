// src/api/api.js
import api from '../Configs/axiosConfig';  // Import từ axiosConfig để dùng chung

// API login
export const loginAPI = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials); // Đảm bảo đường dẫn đúng
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// API logout
export const logoutAPI = async () => {
    try {
        const response = await api.post('/api/auth/logout'); // Đảm bảo đường dẫn đúng
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// API refresh token
export const refreshTokenAPI = async () => {
    try {
        const response = await api.post('/api/auth/refresh-token', {}, { withCredentials: true });  // Đảm bảo endpoint này tồn tại và cần gửi cookie
        return response.data;  // Trả về Access Token mới
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export default api;  // Xuất api instance
