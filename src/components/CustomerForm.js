import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'People',
    name: '',
    address: '',
    email: '',
    phone: '',
    country: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Customer added');
        navigate('/customers');
      } else {
        alert('Failed to add customer');
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
        Add New Customer
      </h1>
      <div className="bg-white p-4 sm:p-6 rounded shadow-md">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            >
              <option>People</option>
              <option>Company</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm sm:text-base">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;