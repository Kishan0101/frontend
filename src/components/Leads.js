import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/leads', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLeads([]);
      }
    };
    fetchLeads();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/leads/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setLeads(leads.filter((lead) => lead._id !== id));
      } else {
        console.error('Error deleting lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleEdit = (lead) => {
    setSelectedLead({ ...lead });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedLead(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/leads/${selectedLead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedLead),
      });
      if (response.ok) {
        const updatedLead = await response.json();
        setLeads(
          leads.map((lead) =>
            lead._id === updatedLead._id ? updatedLead : lead
          )
        );
        handleModalClose();
      } else {
        console.error('Error updating lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedLead((prev) => ({ ...prev, [name]: value }));
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
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Leads</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Lead List</h2>
        <Link
          to="/leads/new"
          className="mb-4 inline-block bg-[#2F80ED] text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-xs sm:text-sm md:text-base transition-colors duration-200"
        >
          Add New Lead
        </Link>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="px-3 sm:px-4 py-2 text-left">Name</th>
                <th className="px-3 sm:px-4 py-2 text-left">Email</th>
                <th className="px-3 sm:px-4 py-2 text-left">Status</th>
                <th className="px-3 sm:px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 sm:px-4 py-2 text-center text-gray-500">
                    No leads available
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <motion.tr
                    key={lead._id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-3 sm:px-4 py-2">{lead.name || 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2">{lead.email || 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2">{lead.status || 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2 flex space-x-2">
                      <motion.button
                        onClick={() => handleViewDetails(lead)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                        View
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(lead)}
                        className="text-green-600 hover:text-green-800 flex items-center text-xs sm:text-sm"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-600 hover:text-red-800 flex items-center text-xs sm:text-sm"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedLead && (
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
                {isEditMode ? 'Edit Lead' : 'Lead Details'}
              </h2>
              {isEditMode ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedLead.name || ''}
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
                      value={selectedLead.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={selectedLead.status || ''}
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
                  <p className="mb-2"><strong>Name:</strong> {selectedLead.name || 'N/A'}</p>
                  <p className="mb-2"><strong>Email:</strong> {selectedLead.email || 'N/A'}</p>
                  <p className="mb-4"><strong>Status:</strong> {selectedLead.status || 'N/A'}</p>
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

export default Leads;