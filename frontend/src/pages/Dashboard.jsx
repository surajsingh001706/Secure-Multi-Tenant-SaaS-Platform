import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TenantContext } from '../context/TenantContext';
import API from '../services/api';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { tenant } = useContext(TenantContext);

    // Analytics State
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);

    // Computed branding style from Context
    const brandStyle = {
        backgroundColor: tenant?.themeColor || '#3b82f6',
    };

    const handleGenerateReport = async () => {
        setLoadingReports(true);
        try {
            await API.post('/analytics/generate');
            alert('Report generation started/completed');
            fetchReports();
        } catch (err) {
            alert('Error generating report');
        }
        setLoadingReports(false);
    };

    const fetchReports = async () => {
        try {
            const { data } = await API.get('/analytics');
            setReports(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 text-white flex flex-col" style={brandStyle}>
                <div className="p-6 text-2xl font-bold flex items-center gap-2">
                    {tenant?.logoUrl && <img src={tenant.logoUrl} alt="Logo" className="w-8 h-8 rounded bg-white" />}
                    {tenant?.name || 'SaaS App'}
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="block py-2 px-4 rounded hover:bg-white/20">Dashboard</a>
                    <a href="/settings" className="block py-2 px-4 rounded hover:bg-white/20">Settings</a>
                </nav>
                <div className="p-4">
                    <button onClick={logout} className="w-full py-2 bg-red-500 hover:bg-red-600 rounded">Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">{user.role}</span>
                </header>

                {/* Stats / Analytics Section */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Weekly AI Analytics</h2>
                        {user.role === 'admin' && (
                            <button onClick={handleGenerateReport} disabled={loadingReports} className="bg-indigo-600 text-white px-4 py-2 rounded">
                                {loadingReports ? 'Generating...' : 'Generate New Report'}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <div key={report._id} className="bg-white p-6 rounded shadow border">
                                <div className="text-sm text-gray-500 mb-2">
                                    {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                                </div>
                                <div className="text-2xl font-bold mb-2">{report.totalActions} Actions</div>
                                <div className="prose text-sm text-gray-700 max-h-40 overflow-y-auto">
                                    {/* Simple render of AI text */}
                                    <pre className="whitespace-pre-wrap font-sans">{report.aiInsights}</pre>
                                </div>
                            </div>
                        ))}
                        {reports.length === 0 && <p className="text-gray-500">No reports generated yet.</p>}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
