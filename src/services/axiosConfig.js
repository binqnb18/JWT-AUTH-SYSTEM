// src/services/axiosConfig.js
import axios from 'axios';

// Tạo một instance của Axios
const api = axios.create({
    baseURL: 'http://localhost:4000/', // Đảm bảo rằng URL của backend API là chính xác
    withCredentials: true, // Cho phép gửi cookie (bao gồm Refresh Token)
});

// Interceptor cho các yêu cầu (request)
api.interceptors.request.use(
    (config) => {
        // Lấy Access Token từ Local Storage
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Nếu có Access Token, thêm vào header của yêu cầu
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; // Trả về config để tiếp tục gửi yêu cầu
    },
    (error) => {
        return Promise.reject(error); // Trả về lỗi nếu có
    }
);

// Interceptor cho các phản hồi (response)
api.interceptors.response.use(
    (response) => {
        return response; // Trả về phản hồi nếu không có lỗi
    },
    async (error) => {
        const originalRequest = error.config; // Lưu lại yêu cầu gốc

        // Kiểm tra nếu lỗi là do token hết hạn (401)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu yêu cầu đã thử lại

            try {
                // Gọi API để làm mới token
                const refreshResponse = await api.post('/auth/refresh-token', {}, { withCredentials: true }); // Đảm bảo endpoint này tồn tại và cần gửi cookie
                const newAccessToken = refreshResponse.data.accessToken; // Lấy Access Token mới từ phản hồi

                // Lưu Access Token mới vào Local Storage
                localStorage.setItem('accessToken', newAccessToken);

                // Cập nhật lại header cho yêu cầu gốc
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Thực hiện lại yêu cầu gốc với Access Token mới
                return api(originalRequest);
            } catch (refreshError) {
                // Nếu lỗi khi làm mới token (ví dụ: refresh token đã hết hạn)
                console.error('Refresh token error:', refreshError);

                // Chuyển hướng đến trang đăng nhập nếu không thể làm mới token
                window.location.href = '/login'; // Hoặc xử lý khác như thông báo lỗi
            }
        }
        return Promise.reject(error); // Trả về lỗi nếu không phải lỗi 401
    }
);

export default api; // Xuất instance của Axios để sử dụng trong ứng dụng
