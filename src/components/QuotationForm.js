import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuotationForm = () => {
  const [items, setItems] = useState([
    { item: '', hsnSac: '', quantity: '', price: '', sgst: '', igst: '', total: 0 },
  ]);
  const [formData, setFormData] = useState({
    number: '',
    client: '',
    clientAddress: '',
    clientEmail: '',
    clientGSTIN: '',
    date: '2025-04-19',
    expireDate: '2025-05-19',
    status: 'Draft',
    year: '',
    currency: '',
    note: '',
  });
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

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

  const handleAddField = () => {
    setItems([...items, { item: '', hsnSac: '', quantity: '', price: '', sgst: '', igst: '', total: 0 }]);
  };

  const handleRemoveField = (index) => {
    if (items.length === 1) {
      alert('At least one item is required');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...items];
    newItems[index][name] = value;
    if (name === 'quantity' || name === 'price') {
      newItems[index].total =
        parseFloat(newItems[index].quantity || 0) * parseFloat(newItems[index].price || 0);
    }
    setItems(newItems);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'client') {
      const selectedCustomer = customers.find((customer) => customer.name === value);
      setFormData({
        ...formData,
        client: value,
        clientAddress: selectedCustomer?.address || '',
        clientEmail: selectedCustomer?.email || '',
        clientGSTIN: selectedCustomer?.GSTIN || '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = subTotal * 0;
    const total = subTotal + tax;
    return { subTotal, tax, total };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.number.trim()) newErrors.number = 'Number is required';
    if (!formData.client) newErrors.client = 'Client is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.expireDate) newErrors.expireDate = 'Expire Date is required';
    if (!['Draft', 'Sent', 'Accepted', 'Declined'].includes(formData.status)) {
      newErrors.status = 'Invalid status';
    }

    const itemErrors = items.map((item, index) => {
      const error = {};
      if (!item.item.trim()) error.item = 'Item name is required';
      if (!item.hsnSac.trim()) error.hsnSac = 'HSN/SAC is required';
      if (!item.quantity || isNaN(item.quantity) || parseFloat(item.quantity) <= 0) {
        error.quantity = 'Valid quantity is required';
      }
      if (!item.price || isNaN(item.price) || parseFloat(item.price) <= 0) {
        error.price = 'Valid price is required';
      }
      return error;
    });

    if (itemErrors.some((error) => Object.keys(error).length > 0)) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { subTotal, tax, total } = calculateTotals();

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Please fix the form errors before submitting');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const quotationData = {
        ...formData,
        items: items.map((item) => ({
          item: item.item,
          hsnSac: item.hsnSac,
          quantity: parseFloat(item.quantity) || 0,
          price: parseFloat(item.price) || 0,
          sgst: parseFloat(item.sgst) || 0,
          igst: parseFloat(item.igst) || 0,
          total: parseFloat(item.total) || 0,
        })),
        subTotal: parseFloat(subTotal),
        tax: parseFloat(tax),
        total: parseFloat(total),
        date: new Date(formData.date).toISOString(),
        expireDate: new Date(formData.expireDate).toISOString(),
      };

      console.log('Sending quotation data:', quotationData);

      const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quotationData),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Quotation saved');
        navigate('/quotations');
      } else {
        console.error('API error:', responseData);
        alert(`Failed to save quotation: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Server error');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">New Quotation</h1>
      <div className="bg-white p-4 sm:p-6 rounded shadow-md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Client</label>
              <select
                name="client"
                value={formData.client}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                  errors.client ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select a client</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.client && <p className="text-red-500 text-xs">{errors.client}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Client Address</label>
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Client Email</label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Client GSTIN</label>
              <input
                type="text"
                name="clientGSTIN"
                value={formData.clientGSTIN}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Number</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                  errors.number ? 'border-red-500' : ''
                }`}
              />
              {errors.number && <p className="text-red-500 text-xs">{errors.number}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Year</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Currency</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                  errors.status ? 'border-red-500' : ''
                }`}
              />
              {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                  errors.date ? 'border-red-500' : ''
                }`}
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Expire Date</label>
              <input
                type="date"
                name="expireDate"
                value={formData.expireDate}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                  errors.expireDate ? 'border-red-500' : ''
                }`}
              />
              {errors.expireDate && <p className="text-red-500 text-xs">{errors.expireDate}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm sm:text-base">Note</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
              ></textarea>
            </div>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-xs sm:text-sm">
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">HSN/SAC</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">SGST</th>
                  <th className="px-4 py-2 text-left">IGST</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="text-sm sm:text-base">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="item"
                        value={item.item}
                        onChange={(e) => handleInputChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                          errors.items?.[index]?.item ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.items?.[index]?.item && (
                        <p className="text-red-500 text-xs">{errors.items[index].item}</p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="hsnSac"
                        value={item.hsnSac}
                        onChange={(e) => handleInputChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                          errors.items?.[index]?.hsnSac ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.items?.[index]?.hsnSac && (
                        <p className="text-red-500 text-xs">{errors.items[index].hsnSac}</p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                          errors.items?.[index]?.quantity ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-red-500 text-xs">{errors.items[index].quantity}</p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="price"
                        value={item.price}
                        onChange={(e) => handleInputChange(index, e)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base ${
                          errors.items?.[index]?.price ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.items?.[index]?.price && (
                        <p className="text-red-500 text-xs">{errors.items[index].price}</p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="sgst"
                        value={item.sgst}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="igst"
                        value={item.igst}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        name="total"
                        value={item.total.toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none text-sm sm:text-base"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={handleAddField}
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm sm:text-base"
            >
              + Add Field
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1 sm:col-span-2"></div>
            <div>
              <div className="mb-2 text-sm sm:text-base">Sub Total: ₹{subTotal.toFixed(2)}</div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm sm:text-base">Tax</label>
                <input
                  type="number"
                  value={tax.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none text-sm sm:text-base"
                />
              </div>
              <div className="text-sm sm:text-base">Total: ₹{total.toFixed(2)}</div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;