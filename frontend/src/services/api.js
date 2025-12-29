import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Interceptor to add Auth Token and Tenant ID
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');

    if (token) {
        config.headers.Authorization = token;
    }

    if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
    }

    return config;
});

export default API;
