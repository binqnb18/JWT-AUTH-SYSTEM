import axios from 'axios';
import * as jwt_decode from 'jwt-decode'; // Để giải mã Access Token

const api = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true, // Cho phép gửi cookie
});

// Biến để theo dõi trạng thái làm mới token
let isRefreshing = false;
let subscribers = []; // Mảng để lưu các yêu cầu cần chờ

// Hàm thêm subscriber
const onRefreshed = (token) => {
    subscribers.forEach((callback) => callback(token));
    subscribers = []; // Xóa danh sách subscribers sau khi đã gọi
};

// Hàm làm mới token
const refreshToken = async () => {
    const response = await api.post('/refresh-token'); // Gọi API làm mới token
    localStorage.setItem('accessToken', response.data.accessToken); // Lưu Access Token mới
    api.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`; // Cập nhật header cho các yêu cầu sau
    onRefreshed(response.data.accessToken); // Gọi lại tất cả các yêu cầu đang chờ
};

// Interceptor cho các yêu cầu
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Đính kèm Access Token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho các phản hồi
api.interceptors.response.use(
    (response) => response, // Trả về phản hồi nếu không có lỗi
    async (error) => {
        const originalRequest = error.config;

        // Nếu token hết hạn (401) và yêu cầu chưa được thử lại
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang làm mới token, hãy chờ cho đến khi hoàn thành
                return new Promise((resolve) => {
                    subscribers.push((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token; // Cập nhật lại header cho yêu cầu
                        resolve(api(originalRequest)); // Thực hiện lại yêu cầu gốc
                    });
                });
            }

            originalRequest._retry = true; // Đánh dấu yêu cầu đã thử lại
            isRefreshing = true; // Đánh dấu rằng chúng ta đang làm mới token

            try {
                await refreshToken(); // Gọi hàm làm mới token
                isRefreshing = false; // Đặt lại trạng thái
                return api(originalRequest); // Thực hiện lại yêu cầu gốc
            } catch (err) {
                isRefreshing = false; // Đặt lại trạng thái nếu có lỗi
                console.error('Refresh token error:', err);
                // Chuyển hướng đến trang đăng nhập nếu không thể làm mới token
                window.location.href = '/login'; // Thay đổi URL này tùy thuộc vào ứng dụng của bạn
            }
        }
        return Promise.reject(error); // Nếu không phải 401, trả về lỗi
    }
);

export default api; // Xuất Axios instance
