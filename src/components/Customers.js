import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/customers/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setCustomers(customers.filter((customer) => customer._id !== id));
        } else {
          console.error('Error deleting customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer({ ...customer });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/customers/${selectedCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedCustomer),
      });
      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomers(
          customers.map((customer) =>
            customer._id === updatedCustomer._id ? updatedCustomer : customer
          )
        );
        handleModalClose();
      } else {
        console.error('Error updating customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

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
                <th className="px-3 sm:px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer._id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-3 sm:px-4 py-2">{customer.type}</td>
                  <td className="px-3 sm:px-4 py-2">{customer.name}</td>
                  <td className="px-3 sm:px-4 py-2">{customer.country}</td>
                  <td className="px-3 sm:px-4 py-2">{customer.phone}</td>
                  <td className="px-3 sm:px-4 py-2 flex space-x-2">
                    <motion.button
                      onClick={() => handleViewDetails(customer)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm"
                      title="View"
                    >
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                      View
                    </motion.button>
                    <motion.button
                      onClick={() => handleEdit(customer)}
                      className="text-green-600 hover:text-green-800 flex items-center text-xs sm:text-sm"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                      Edit
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(customer._id)}
                      className="text-red-600 hover:text-red-800 flex items-center text-xs sm:text-sm"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedCustomer && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              variants={modalVariants}
            >
              <h2 className="text-lg font-bold mb-4">
                {isEditMode ? 'Edit Customer' : 'Customer Details'}
              </h2>
              {isEditMode ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={selectedCustomer.type}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedCustomer.name}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={selectedCustomer.address}
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
                      value={selectedCustomer.email}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={selectedCustomer.phone}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={selectedCustomer.country}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleModalClose}
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
              ) : (
                <div>
                  <p className="mb-2"><strong>Type:</strong> {selectedCustomer.type}</p>
                  <p className="mb-2"><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p className="mb-2"><strong>Address:</strong> {selectedCustomer.address}</p>
                  <p className="mb-2"><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p className="mb-2"><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p className="mb-4"><strong>Country:</strong> {selectedCustomer.country}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={handleModalClose}
                      className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;