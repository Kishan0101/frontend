import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LeadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate('/leads');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error creating lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      setError('Failed to create lead. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/leads');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Add New Lead</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-md mx-auto">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
              required
            >
              <option value="">Select Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;