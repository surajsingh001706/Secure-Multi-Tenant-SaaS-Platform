import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await API.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error('Auth Check Failed', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password, tenantId) => {
        // If login requires x-tenant-id header, we need to set it temporarily or pass it.
        // However, our API intercepts it from localStorage. 
        // We must set tenantId in LS before request if our login endpoint needs it in header.
        // But usually login body has email, and if email is unique globally, we are fine.
        // Per requirements: "Identify tenant using... x-tenant-id... on EVERY request".
        // So we should probably set it first if we know it, or user selects it.
        // For now, let's assume user enters Tenant ID or Subdomain (simulated by ID) during login or before.

        // Simplification: User enters everything.
        localStorage.setItem('tenantId', tenantId);

        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        // Refresh to apply new context if needed, or just set state
    };

    const register = async (payload) => {
        const { data } = await API.post('/auth/register', payload);
        localStorage.setItem('token', data.token);
        localStorage.setItem('tenantId', data.tenant.id);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tenantId');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
