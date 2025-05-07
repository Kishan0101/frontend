import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, PencilIcon, TrashIcon, CurrencyRupeeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching payments with token:', token);
      if (!token) {
        console.log('No token found, navigating to login');
        navigate('/login');
        return;
      }
      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetch response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      console.log('Fetched payments data:', data);
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setError('Failed to load payments');
    }
  };

  useEffect(() => {
    fetchPayments();
    // Check if navigated here after a quotation update
    const params = new URLSearchParams(location.search);
    if (params.get('refresh') === 'true') {
      console.log('Refreshing payments due to recent quotation update');
      fetchPayments();
    }
  }, [navigate, location]);

  const handleRefresh = () => {
    fetchPayments();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (payment) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay SDK');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: payment.amount,
          paymentId: payment._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const order = await response.json();

      const options = {
        key: 'rzp_test_g0r4RIG5d4ad4Q',
        amount: order.amount,
        currency: order.currency,
        name: 'Webbiify Payments',
        description: `Payment for Quotation`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const updateResponse = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/${payment._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                customerName: payment.customerName,
                amount: payment.amount,
                date: payment.date,
                status: 'Completed',
                razorpayPaymentId: response.razorpay_payment_id,
              }),
            });

            if (updateResponse.ok) {
              const updatedPayment = await updateResponse.json();
              setPayments(
                payments.map((p) =>
                  p._id === updatedPayment._id ? updatedPayment : p
                )
              );
            }
          } catch (error) {
            console.error('Error updating payment status:', error);
            setError('Failed to update payment status');
          }
        },
        prefill: {
          name: payment.customerName,
        },
        theme: {
          color: '#2F80ED',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
      });
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Failed to initiate payment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setPayments(payments.filter((payment) => payment._id !== id));
      } else {
        console.error('Error deleting payment');
        setError('Failed to delete payment');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      setError('Failed to delete payment');
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment({ ...payment });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/${selectedPayment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedPayment),
      });
      if (response.ok) {
        const updatedPayment = await response.json();
        setPayments(
          payments.map((payment) =>
            payment._id === updatedPayment._id ? updatedPayment : payment
          )
        );
        handleModalClose();
      } else {
        console.error('Error updating payment');
        setError('Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      setError('Failed to update payment');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPayment((prev) => ({ ...prev, [name]: value }));
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
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Payments</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold">Payment List</h2>
          <motion.button
            onClick={handleRefresh}
            className="text-gray-600 hover:text-gray-800 flex items-center text-xs sm:text-sm"
            title="Refresh"
          >
            <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
            Refresh
          </motion.button>
        </div>
        <Link
          to="/payments/new"
          className="mb-4 inline-block bg-[#2F80ED] text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-xs sm:text-sm md:text-base transition-colors duration-200"
        >
          Add New Payment
        </Link>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="px-3 sm:px-4 py-2 text-left">Customer Name</th>
                <th className="px-3 sm:px-4 py-2 text-left">Amount</th>
                <th className="px-3 sm:px-4 py-2 text-left">Date</th>
                <th className="px-3 sm:px-4 py-2 text-left">Status</th>
                <th className="px-3 sm:px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 sm:px-4 py-2 text-center text-gray-500">
                    No payments available
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <motion.tr
                    key={payment._id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b hover:bg-gray-100"
                  >
                    <td className="px-3 sm:px-4 py-2">{payment.customerName || 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2">{payment.amount ? `₹${payment.amount.toFixed(2)}` : 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2">{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2">{payment.status || 'N/A'}</td>
                    <td className="px-3 sm:px-4 py-2 flex space-x-2">
                      {payment.status === 'Pending' && (
                        <motion.button
                          onClick={() => handlePayNow(payment)}
                          className="text-purple-600 hover:text-purple-800 flex items-center text-xs sm:text-sm"
                          title="Pay Now"
                        >
                          <CurrencyRupeeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                          Pay Now
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => handleViewDetails(payment)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-xs sm:text-sm"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                        View
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(payment)}
                        className="text-green-600 hover:text-green-800 flex items-center text-xs sm:text-sm"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 inline-block align-middle" />
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(payment._id)}
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
        {showModal && selectedPayment && (
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
                {isEditMode ? 'Edit Payment' : 'Payment Details'}
              </h2>
              {isEditMode ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={selectedPayment.customerName || ''}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={selectedPayment.amount || ''}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={selectedPayment.date ? new Date(selectedPayment.date).toISOString().split('T')[0] : ''}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={selectedPayment.status || ''}
                      onChange={handleInputChange}
                      className="mt-1 p-2 w-full border rounded-lg text-sm"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
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
                  <p className="mb-2"><strong>Customer Name:</strong> {selectedPayment.customerName || 'N/A'}</p>
                  <p className="mb-2"><strong>Amount:</strong> {selectedPayment.amount ? `₹${selectedPayment.amount.toFixed(2)}` : 'N/A'}</p>
                  <p className="mb-2"><strong>Date:</strong> {selectedPayment.date ? new Date(selectedPayment.date).toLocaleDateString() : 'N/A'}</p>
                  <p className="mb-2"><strong>Status:</strong> {selectedPayment.status || 'N/A'}</p>
                  <p className="mb-4"><strong>Razorpay Payment ID:</strong> {selectedPayment.razorpayPaymentId || 'N/A'}</p>
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

export default Payments;