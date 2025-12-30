import { useState, useContext } from 'react';
import { TenantContext } from '../context/TenantContext';
import API from '../services/api';

const Settings = () => {
    const { tenant, refreshTenant } = useContext(TenantContext);
    const [themeColor, setThemeColor] = useState(tenant?.themeColor || '#3b82f6');
    const [file, setFile] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('themeColor', themeColor);
        if (file) {
            formData.append('logo', file);
        }

        try {
            await API.put('/tenant/branding', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            await refreshTenant();
            alert('Branding Updated!');
        } catch (error) {
            alert('Update failed');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Tenant Settings</h1>

            <div className="bg-white p-6 rounded shadow border max-w-lg">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Theme Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={themeColor}
                                onChange={(e) => setThemeColor(e.target.value)}
                                className="h-10 w-10 p-0 border-0"
                            />
                            <span className="text-gray-600">{themeColor}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Logo Upload</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {tenant?.logoUrl && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Current Logo:</p>
                            <img src={tenant.logoUrl} alt="Branding" className="h-12 object-contain" />
                        </div>
                    )}

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </form>
            </div>

            <a href="/dashboard" className="block mt-4 text-blue-500 hover:underline">&larr; Back to Dashboard</a>
        </div>
    );
};

export default Settings;
