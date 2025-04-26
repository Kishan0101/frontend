import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EAF2FE] px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-8">Sign In</h1>
          <div className="space-y-5">
            <div className="flex flex-col items-center">
              <label className="block text-gray-600 text-sm mb-1 w-80 text-center">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-80 px-3 py-2 bg-[#F5F7FA] border-none rounded-lg focus:outline-none text-sm"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-gray-600 text-sm mb-1 w-80 text-center">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-80 px-3 py-2 bg-[#F5F7FA] border-none rounded-lg focus:outline-none text-sm"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-80 mx-auto block bg-[#2F80ED] text-white py-2 px-4 rounded-lg hover:bg-blue-700 uppercase text-sm font-semibold transition-colors duration-200"
            >
              Log In
            </button>
            <p className="mt-4 text-center text-sm">
              Or{' '}
              <a href="/register" className="text-[#2F80ED] hover:underline">
                Register Now!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;