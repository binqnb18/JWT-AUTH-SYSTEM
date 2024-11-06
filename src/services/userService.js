// src/services/userService.js
import api from './axiosConfig'; // Import Axios instance

// Hàm gọi API bảo vệ
export const fetchUserData = async () => {
    const token = localStorage.getItem('accessToken'); // Lấy Access Token từ localStorage
    try {
        const response = await api.get('/user', {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
    }
};
