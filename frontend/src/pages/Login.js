import api from '../services/api';

const handleLogin = async (username, password) => {
    try {
        const response = await api.post('login/', { username, password });
    } catch (error) {
        console.error('Login failed:', error.response.data);
    }
};
