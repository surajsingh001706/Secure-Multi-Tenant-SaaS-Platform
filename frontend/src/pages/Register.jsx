import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        tenantName: '',
        subdomain: '',
        name: '',
        email: '',
        password: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error) {
            alert('Registration Failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register Tenant</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="tenantName" placeholder="Company Name" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="subdomain" placeholder="Subdomain" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="name" placeholder="Admin Name" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        Register & Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
