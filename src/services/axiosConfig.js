import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api/auth', // Đảm bảo baseURL là chính xác
    withCredentials: true, // Cho phép gửi cookie cùng với yêu cầu
});


// Interceptor cho các yêu cầu
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken'); // Lấy Access Token từ localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho các phản hồi
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu token hết hạn (401), gọi API để làm mới token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu yêu cầu đã thử lại
            try {
                const response = await api.post('/refresh-token', {}); // Gọi API làm mới token
                localStorage.setItem('accessToken', response.data.accessToken); // Lưu Access Token mới
                api.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`; // Cập nhật header cho các yêu cầu sau
                return api(originalRequest); // Thực hiện lại yêu cầu gốc
            } catch (err) {
                console.error('Refresh token error:', err); // Ghi log lỗi
                // Xử lý khi không thể làm mới token (ví dụ: đăng xuất người dùng)
            }
        }
        return Promise.reject(error); // Nếu không phải 401, trả về lỗi
    }
);

export default api; // Xuất Axios instance
