import { default as jwt_decode } from 'jwt-decode';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];
let refreshTimeoutId;

function onRefreshed(token) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

function addRequestToQueue(originalRequest) {
    return new Promise(resolve => {
        refreshSubscribers.push(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(api(originalRequest));
        });
    });
}

function scheduleTokenRefresh(token) {
    const { exp } = jwt_decode(token);
    const refreshTime = exp * 1000 - Date.now() - 2 * 60 * 1000;

    if (refreshTime > 0) {
        refreshTimeoutId = setTimeout(refreshToken, refreshTime);
        console.info("Token sẽ được làm mới sau:", refreshTime / 1000, "giây");
    } else {
        refreshToken();
    }
}

async function refreshToken() {
    try {
        const response = await api.post('/api/auth/refresh-token');
        const newToken = response.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        console.info("Access Token mới:", newToken);
        scheduleTokenRefresh(newToken);
        onRefreshed(newToken);
    } catch (error) {
        console.warn("Làm mới token lỗi:", error);
        window.location.href = '/login';
    }
}

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return addRequestToQueue(originalRequest);
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post('/api/auth/refresh-token');
                const newToken = response.data.accessToken;
                localStorage.setItem('accessToken', newToken);
                scheduleTokenRefresh(newToken);
                onRefreshed(newToken);
                isRefreshing = false;

                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

function logoutUser() {
    localStorage.removeItem('accessToken');
    clearTimeout(refreshTimeoutId);
    refreshSubscribers = [];
    window.location.href = '/login';
}

export default api;
export { scheduleTokenRefresh, logoutUser };
