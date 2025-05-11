import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    address: '',
    phone: '',
    quotationNo: '',
    items: [],
    subTotal: '',
    tax: '',
    total: '',
    status: '',
    year: '',
    currency: '',
    amount: '',
    date: '',
  });
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch customers');
          setCustomers([]);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'customerName') {
      const selectedCustomer = customers.find((customer) => customer.name === value);
      if (selectedCustomer) {
        // Fetch the latest quotation for the selected customer
        fetchQuotation(selectedCustomer);
      } else {
        setFormData({
          ...formData,
          customerName: value,
          companyName: '',
          address: '',
          phone: '',
          quotationNo: '',
          items: [],
          subTotal: '',
          tax: '',
          total: '',
          status: '',
          year: '',
          currency: '',
          amount: '',
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchQuotation = async (customer) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://webbiify-kishan0101s-projects.vercel.app/api/quotations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const quotations = await response.json();
        // Find the latest quotation for the selected customer
        const customerQuotation = quotations
          .filter((q) => q.client === customer.name)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setFormData({
          ...formData,
          customerName: customer.name,
          companyName: customer.name || '',
          address: customer.address || '',
          phone: customer.phone || '',
          quotationNo: customerQuotation ? customerQuotation.quotationNo : '',
          items: customerQuotation ? customerQuotation.items : [],
          subTotal: customerQuotation ? customerQuotation.subTotal.toString() : '',
          tax: customerQuotation ? customerQuotation.tax.toString() : '',
          total: customerQuotation ? customerQuotation.total.toString() : '',
          status: customerQuotation ? customerQuotation.status : '',
          year: customerQuotation ? customerQuotation.year : '',
          currency: customerQuotation ? customerQuotation.currency : '',
          amount: customerQuotation ? customerQuotation.total.toString() : '',
        });
      } else {
        console.error('Failed to fetch quotations');
        setFormData({
          ...formData,
          customerName: customer.name,
          companyName: customer.name || '',
          address: customer.address || '',
          phone: customer.phone || '',
          quotationNo: '',
          items: [],
          subTotal: '',
          tax: '',
          total: '',
          status: '',
          year: '',
          currency: '',
          amount: '',
        });
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setFormData({
        ...formData,
        customerName: customer.name,
        companyName: customer.name || '',
        address: customer.address || '',
        phone: customer.phone || '',
        quotationNo: '',
        items: [],
        subTotal: '',
        tax: '',
        total: '',
        status: '',
        year: '',
        currency: '',
        amount: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount) || 0,
          subTotal: parseFloat(formData.subTotal) || 0,
          tax: parseFloat(formData.tax) || 0,
          total: parseFloat(formData.total) || 0,
        }),
      });
      if (response.ok) {
        navigate('/payments');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error creating payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setError('Failed to create payment. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/payments');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Add New Payment</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-md mx-auto">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <select
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg text-sm"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
            <input
              type="text"
              name="quotationNo"
              value={formData.quotationNo}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <textarea
              name="items"
              value={formData.items.map(item => `${item.item} (Qty: ${item.quantity}, Price: ${item.price})`).join('\n')}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Sub Total</label>
            <input
              type="text"
              name="subTotal"
              value={formData.subTotal}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tax</label>
            <input
              type="text"
              name="tax"
              value={formData.tax}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <input
              type="text"
              name="total"
              value={formData.total}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quotation Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              readOnly
              className="mt-1 p-2 w-full border rounded-lg bg-gray-100 text-sm"
            />
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

export default PaymentForm;