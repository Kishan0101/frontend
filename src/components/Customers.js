import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Customers</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Customer List</h2>
        <Link
          to="/customers/new"
          className="mb-4 inline-block bg-[#2F80ED] text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-xs sm:text-sm md:text-base transition-colors duration-200"
        >
          Add New Customer
        </Link>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="px-3 sm:px-4 py-2 text-left">Type</th>
                <th className="px-3 sm:px-4 py-2 text-left">Name</th>
                <th className="px-3 sm:px-4 py-2 text-left">Country</th>
                <th className="px-3 sm:px-4 py-2 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-3 sm:px-4 py-2">{customer.type}</td>
                  <td className="px-3 sm:px-4 py-2">{customer.name}</td>
                  <td className="px-3 sm:px-4 py-2">{customer.country}</td>
                  <td className="px-3 sm:px-4 py-2">{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;