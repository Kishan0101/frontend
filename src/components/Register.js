import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/auth/register', {
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
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EAF2FE] px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Register
        </h1>
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-gray-600 text-sm mb-1 text-left">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full sm:w-80 mx-auto block px-3 py-2 bg-[#F5F7FA] border-none rounded-lg focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1 text-left">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full sm:w-80 mx-auto block px-3 py-2 bg-[#F5F7FA] border-none rounded-lg focus:outline-none text-sm"
            />
          </div>
          <button
            onClick={handleRegister}
            className="w-full sm:w-80 mx-auto block bg-[#2F80ED] text-white py-2 px-4 rounded-lg hover:bg-blue-700 uppercase text-sm font-semibold transition-colors duration-200"
          >
            Register
          </button>
          <p className="mt-3 text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-[#2F80ED] hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;