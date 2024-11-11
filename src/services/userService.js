import api from '../Configs/axiosConfig';

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post('/api/auth/logout');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const refreshTokenAPI = async () => {
    try {
        const response = await api.post('/api/auth/refresh-token', {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};
