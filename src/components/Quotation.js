import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import logo from '../components/Assests/Webbiify.png';
import stamp from '../components/Assests/stamp.png';
import bank from '../components/Assests/bankdetails.jpeg';

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    client: '',
    date: '',
    expireDate: '',
    items: [{ item: '', quantity: 0, price: 0, total: 0 }],
    subTotal: 0,
    tax: 0,
    total: 0,
    status: 'Draft',
    year: '',
    currency: '',
    note: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/quotations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData);
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
          setQuotations([]);
          return;
        }

        const data = await response.json();
        setQuotations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching quotations:', error);
        setQuotations([]);
      }
    };

    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://webbiify-git-main-kishan0101s-projects.vercel.app/api/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API error:', errorData);
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
          setCustomers([]);
          return;
        }

        const data = await response.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };

    fetchQuotations();
    fetchCustomers();
  }, [navigate]);

  const openEditModal = async (quote) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/quotations/${quote._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          number: data.number,
          client: data.client,
          date: new Date(data.date).toISOString().split('T')[0],
          expireDate: new Date(data.expireDate).toISOString().split('T')[0],
          items: data.items,
          subTotal: data.subTotal,
          tax: data.tax || 0,
          total: data.total,
          status: data.status,
          year: data.year || '',
          currency: data.currency || '',
          note: data.note || '',
        });
        setSelectedQuote(data);
        setEditModal(true);
      } else {
        alert('Failed to fetch quotation details');
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      alert('Server error');
    }
  };

  const openDetailsModal = async (quote) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/quotations/${quote._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedQuote(data);
        setDetailsModal(true);
      } else {
        alert('Failed to fetch quotation details');
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
      alert('Server error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/quotations/${selectedQuote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedQuote = await response.json();
        setQuotations((prev) =>
          prev.map((quote) => (quote._id === updatedQuote._id ? updatedQuote : quote))
        );
        setEditModal(false);
        alert('Quotation updated successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to update quotation: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating quotation:', error);
      alert('Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://webbiify-git-main-kishan0101s-projects.vercel.app/api/quotations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setQuotations((prev) => prev.filter((quote) => quote._id !== id));
        alert('Quotation deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete quotation: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Server error');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  // Styles for the PDF
  const styles = StyleSheet.create({
    page: {
      padding: 15,
      fontFamily: 'Helvetica',
      fontSize: 10,
      color: '#646464',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    logo: {
      width: 60,
      height: 30,
    },
    companyDetails: {
      textAlign: 'right',
      fontSize: 8,
      lineHeight: 1.2,
    },
    titleContainer: {
      backgroundColor: '#0b0337',
      padding: 3,
      marginBottom: 8,
    },
    title: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    quoteDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    clientDetailsContainer: {
      border: '1px solid #0b0337',
      padding: 3,
      marginBottom: 8,
    },
    clientDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    clientDetailsColumn: {
      width: '48%',
      lineHeight: 1.2,
    },
    sectionTitle: {
      color: '#0b0337',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 1,
    },
    termsTitle: {
      color: '#0b0337',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 1,
      marginTop: 150,
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#0b0337',
      marginBottom: 8,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#0b0337',
    },
    tableHeader: {
      backgroundColor: '#0b0337',
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: 2,
      fontSize: 8,
      textAlign: 'left',
      borderRightWidth: 1,
      borderRightColor: '#0b0337',
    },
    tableCellLast: {
      padding: 2,
      fontSize: 8,
      textAlign: 'left',
    },
    rightColumn: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginBottom: 8,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    bankImage: {
      width: 90,
      height: 90,
      marginRight: 180,
      marginTop: 20,
    },
    amountBox: {
      border: '1px solid #0b0337',
      width: 100,
      padding: 3,
      backgroundColor: '#FFFFFF',
    },
    amountLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    amountTotal: {
      fontWeight: 'bold',
      color: '#000000',
    },
    signature: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 5,
    },
    signatureText: {
      color: '#0b0337',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    stamp: {
      width: 90,
      height: 90,
    },
    bankDetails: {
      marginBottom: 40,
    },
    bankDetailLine: {
      marginBottom: 0.5,
    },
    footer: {
      position: 'absolute',
      bottom: 15,
      left: 15,
      right: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 8,
    },
  });

  // PDF Document Component
  const QuotationPDF = ({ quote }) => {
    const items = quote.items || [];
    const sgstTotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0) * ((parseFloat(item.sgst) || 0) / 100), 0);
    const cgstTotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0) * ((parseFloat(item.igst) || 0) / 100), 0);

    const client = customers.find((customer) => customer.name === quote.client) || {};

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.companyDetails}>
              <Text>Webbiify Infotech</Text>
              <Text>Barabanki Lucknow U.P. 225001</Text>
              <Text>Email: info@webbiify.com</Text>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Quotation</Text>
          </View>
          <View style={styles.quoteDetails}>
            <View>
              <Text>Quotation No: {quote.quotationNo || 'N/A'}</Text>
              <Text>Date: {new Date(quote.date).toLocaleDateString()}</Text>
            </View>
            <View>
              <Text>Validity Date: {new Date(quote.expireDate).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={styles.clientDetailsContainer}>
            <View style={styles.clientDetails}>
              <View style={styles.clientDetailsColumn}>
                <Text style={styles.sectionTitle}>From:</Text>
                <Text>Webbiify Infotech</Text>
                <Text>Barabanki Lucknow U.P. 225001</Text>
                <Text>Email: info@webbiify.com</Text>
              </View>
              <View style={styles.clientDetailsColumn}>
                <Text style={styles.sectionTitle}>To:</Text>
                <Text>Client: {quote.client || 'N/A'}</Text>
                <Text>Address: {client.address || '[Client Address]'}</Text>
                <Text>Email: {client.email || '[Client Email]'}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '10%' }]}>S.No.</Text>
              <Text style={[styles.tableCell, { width: '30%' }]}>Description</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>HSN/SAC</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>Qty</Text>
              <Text style={[styles.tableCell, { width: '12%' }]}>Unit Price</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>SGST</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>CGST</Text>
              <Text style={[styles.tableCellLast, { width: '12%' }]}>Total</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && { backgroundColor: '#F0F0F0' }]}>
                <Text style={[styles.tableCell, { width: '10%' }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { width: '30%' }]}>{item.item || 'N/A'}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{item.hsnSac || 'N/A'}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{item.quantity || 0}</Text>
                <Text style={[styles.tableCell, { width: '12%' }]}>{parseFloat(item.price || 0).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{parseFloat(item.sgst || 0)}%</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{parseFloat(item.igst || 0)}%</Text>
                <Text style={[styles.tableCellLast, { width: '12%' }]}>{parseFloat(item.total || 0).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.amountContainer}>
              <Image src={bank} style={styles.bankImage} />
              <View style={styles.amountBox}>
                <Text style={styles.sectionTitle}>Amount Details</Text>
                <View style={styles.amountLine}>
                  <Text>Subtotal:</Text>
                  <Text>{parseFloat(quote.subTotal || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.amountLine}>
                  <Text>SGST:</Text>
                  <Text>{sgstTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.amountLine}>
                  <Text>CGST:</Text>
                  <Text>{cgstTotal.toFixed(2)}</Text>
                </View>
                <View style={[styles.amountLine, styles.amountTotal]}>
                  <Text>Total:</Text>
                  <Text>{(parseFloat(quote.subTotal || 0) + sgstTotal + cgstTotal).toFixed(2)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.signature}>
              <Text style={styles.signatureText}>Authorized Signature</Text>
              <Image src={stamp} style={styles.stamp} />
            </View>
          </View>
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.bankDetails}>
            <Text style={styles.bankDetailLine}>Account Number: 97138100000209</Text>
            <Text style={styles.bankDetailLine}>IFSC Code: BARB0DBBLUC</Text>
            <Text style={styles.bankDetailLine}>MICR Code: 226012055</Text>
          </View>
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          <Text>1. Payment due within 30 days.</Text>
          <Text>2. All services subject to terms at www.webbiify.com.</Text>
          <View style={styles.footer} fixed>
            <Text>Webbiify Infotech | www.webbiify.com</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </Page>
      </Document>
    );
  };

  const handleDownload = async (quote) => {
    const doc = <QuotationPDF quote={quote} />;
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation_${quote.quotationNo || 'N/A'}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Quotes For Customers</h1>
      <div className="bg-white p-4 sm:p-6 rounded shadow-md">
        <Link
          to="/quotations/new"
          className="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
        >
          Add New Quotation
        </Link>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm sm:text-base">
                <th className="px-4 py-2 text-left">Number</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Expired Date</th>
                <th className="px-4 py-2 text-left">Sub Total</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-2 text-center text-gray-500">
                    No quotations available
                  </td>
                </tr>
              ) : (
                quotations.map((quote) => (
                  <tr key={quote._id} className="border-b hover:bg-gray-100 text-sm sm:text-base">
                    <td className="px-4 py-2">{quote.number || 'N/A'}</td>
                    <td className="px-4 py-2">{quote.client || 'N/A'}</td>
                    <td className="px-4 py-2">{new Date(quote.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(quote.expireDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{parseFloat(quote.subTotal || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">{parseFloat(quote.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">{quote.status || 'N/A'}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => openEditModal(quote)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(quote._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openDetailsModal(quote)}
                        className="text-purple-500 hover:text-purple-700"
                        title="Details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDownload(quote)}
                        className="text-green-500 hover:text-green-700"
                        title="Download"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Quotation</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium">Number</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Client</label>
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Client</option>
                    {customers.map((customer) => (
                      <option key={customer._id} value={customer.name}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Expire Date</label>
                  <input
                    type="date"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Sub Total</label>
                  <input
                    type="number"
                    name="subTotal"
                    value={formData.subTotal}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tax</label>
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Total</label>
                  <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Item"
                      value={item.item}
                      onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                      className="p-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Total"
                      value={item.total}
                      onChange={(e) => handleItemChange(index, 'total', parseFloat(e.target.value))}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Quotation Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-medium">Quotation No:</p>
                <p>{selectedQuote.quotationNo || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Number:</p>
                <p>{selectedQuote.number || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Client:</p>
                <p>{selectedQuote.client || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Date:</p>
                <p>{new Date(selectedQuote.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Expire Date:</p>
                <p>{new Date(selectedQuote.expireDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Sub Total:</p>
                <p>{parseFloat(selectedQuote.subTotal || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">Tax:</p>
                <p>{parseFloat(selectedQuote.tax || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">Total:</p>
                <p>{parseFloat(selectedQuote.total || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <p>{selectedQuote.status || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Year:</p>
                <p>{selectedQuote.year || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Currency:</p>
                <p>{selectedQuote.currency || 'N/A'}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="font-medium">Items:</p>
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Item</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedQuote.items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{item.item || 'N/A'}</td>
                      <td className="p-2 border">{item.quantity || 0}</td>
                      <td className="p-2 border">{parseFloat(item.price || 0).toFixed(2)}</td>
                      <td className="p-2 border">{parseFloat(item.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-4">
              <p className="font-medium">Note:</p>
              <p>{selectedQuote.note || 'N/A'}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setDetailsModal(false)}
                className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;