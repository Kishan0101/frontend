import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    quotationId: '',
    amount: '',
    date: '',
    status: '',
    razorpayOrderId: '',
    razorpayPaymentId: '',
  });
  const [customers, setCustomers] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerPayments, setCustomerPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch customers
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          setError('Failed to load customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to load customers');
      }
    };

    // Fetch payment data for editing
    const fetchPayment = async () => {
      try {
        const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const payment = await response.json();
          setFormData({
            quotationId: payment.quotationId._id,
            amount: payment.amount,
            date: new Date(payment.date).toISOString().split('T')[0],
            status: payment.status,
            razorpayOrderId: payment.razorpayOrderId || '',
            razorpayPaymentId: payment.razorpayPaymentId || '',
          });
          setSelectedCustomer(payment.quotationId.client);
          // Fetch quotations for the customer
          fetchQuotations(payment.quotationId.client);
          // Fetch payments for the customer
          fetchCustomerPayments(payment.quotationId.client);
        } else {
          setError('Failed to load payment data');
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
        setError('Failed to load payment data');
      }
    };

    fetchCustomers();
    if (isEdit) {
      fetchPayment();
    }
  }, [id, isEdit, navigate]);

  // Fetch quotations for the selected customer
  const fetchQuotations = async (customerName) => {
    if (!customerName) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/quotations/${encodeURIComponent(
          customerName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setQuotations(data);
      } else {
        setError('Failed to load quotations');
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setError('Failed to load quotations');
    }
  };

  // Fetch payments for the selected customer
  const fetchCustomerPayments = async (customerName) => {
    if (!customerName) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/customer/${encodeURIComponent(
          customerName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCustomerPayments(data);
      } else {
        setError('Failed to load customer payments');
      }
    } catch (error) {
      console.error('Error fetching customer payments:', error);
      setError('Failed to load customer payments');
    }
  };

  const handleCustomerChange = (e) => {
    const customerName = e.target.value;
    setSelectedCustomer(customerName);
    setFormData((prev) => ({ ...prev, quotationId: '' })); // Reset quotation selection
    setQuotations([]); // Clear previous quotations
    fetchQuotations(customerName);
    fetchCustomerPayments(customerName);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const url = isEdit
        ? `https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments/${id}`
        : 'https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        navigate('/payments');
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Error ${isEdit ? 'updating' : 'creating'} payment`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} payment:`, error);
      setError(`Failed to ${isEdit ? 'update' : 'create'} payment. Please try again.`);
    }
  };

  const handleCancel = () => {
    navigate('/payments');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        {isEdit ? 'Edit Payment' : 'Add New Payment'}
      </h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-md mx-auto">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={selectedCustomer}
              onChange={handleCustomerChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer} value={customer}>
                  {customer}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quotation</label>
            <select
              name="quotationId"
              value={formData.quotationId}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
              required
              disabled={!selectedCustomer}
            >
              <option value="">Select Quotation</option>
              {quotations.map((quotation) => (
                <option key={quotation._id} value={quotation._id}>
                  {quotation.number} (₹{quotation.total})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
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
              value={formData.date}
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
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Razorpay Order ID (Optional)</label>
            <input
              type="text"
              name="razorpayOrderId"
              value={formData.razorpayOrderId}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Razorpay Payment ID (Optional)</label>
            <input
              type="text"
              name="razorpayPaymentId"
              value={formData.razorpayPaymentId}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
            />
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
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
      {customerPayments.length > 0 && (
        <div className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold mb-4">Payments for {selectedCustomer}</h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quotation</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {customerPayments.map((payment) => (
                  <tr key={payment._id} className="border-t">
                    <td className="px-4 py-2 text-sm">{payment.quotationId.number}</td>
                    <td className="px-4 py-2 text-sm">₹{payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : payment.status === 'Failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
