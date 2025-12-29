import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);

    // Load tenant info when ID changes or on mount
    const fetchTenant = async () => {
        const tenantId = localStorage.getItem('tenantId');
        if (tenantId) {
            try {
                const { data } = await API.get('/tenant/info');
                setTenant(data);

                // Apply Branding Dynamically
                if (data.themeColor) {
                    document.documentElement.style.setProperty('--primary-color', data.themeColor);
                }
            } catch (error) {
                console.error('Tenant Fetch Error', error);
            }
        }
    };

    useEffect(() => {
        fetchTenant(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Could depend on auth state too

    return (
        <TenantContext.Provider value={{ tenant, refreshTenant: fetchTenant }}>
            {children}
        </TenantContext.Provider>
    );
};
