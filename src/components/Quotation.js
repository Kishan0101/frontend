import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import logo from '../components/Assests/Webbiify.png';
import stamp from '../components/Assests/stamp.png';
import bank from '../components/Assests/bankdetails.jpeg';

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/quotations', {
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
        const response = await fetch('http://localhost:5000/api/customers', {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quotations/${id}`, {
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
      marginTop: 10, // Added spacing before Terms and Conditions
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
      width: 45,
      height: 45,
      marginRight: 180,
      marginTop: 90,
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
      marginBottom: 3,
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

    // Find the customer matching the quote's client name
    const client = customers.find((customer) => customer.name === quote.client) || {};

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header: Logo and Company Details */}
          <View style={styles.header}>
            <Image src={logo} style={styles.logo} />
            <View style={styles.companyDetails}>
              <Text>Webbify Infotech</Text>
              <Text>Barabanki Lucknow U.P. 225001</Text>
              <Text>Email: info@webbiify.com</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Quotation</Text>
          </View>

          {/* Quotation Details */}
          <View style={styles.quoteDetails}>
            <View>
              <Text>Quotation No: {quote.quotationNo || 'N/A'}</Text>
              <Text>Date: {new Date(quote.date).toLocaleDateString()}</Text>
            </View>
            <View>
              <Text>Validity Date: {new Date(quote.expireDate).toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Client Details */}
          <View style={styles.clientDetailsContainer}>
            <View style={styles.clientDetails}>
              <View style={styles.clientDetailsColumn}>
                <Text style={styles.sectionTitle}>From:</Text>
                <Text>Webbify Infotech</Text>
                <Text>Barabanki Lucknow U.P. 	225001</Text>
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

          {/* Items Table */}
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
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
            {/* Table Body */}
            {items.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && { backgroundColor: '#F0F0F0' }]}>
                <Text style={[styles.tableCell, { width: '10%' }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { width: '30%' }]}>{item.item || 'N/A'}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{item.hsnSac || 'N/A'}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{item.quantity || 0}</Text>
                <Text style={[styles.tableCell, { width: '12%' }]}>₹{parseFloat(item.price || 0).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{parseFloat(item.sgst || 0)}%</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>{parseFloat(item.igst || 0)}%</Text>
                <Text style={[styles.tableCellLast, { width: '12%' }]}>₹{parseFloat(item.total || 0).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Right Column for Amount Details with Bank Image */}
          <View style={styles.rightColumn}>
            <View style={styles.amountContainer}>
              <Image src={bank} style={styles.bankImage} />
              <View style={styles.amountBox}>
                <Text style={styles.sectionTitle}>Amount Details</Text>
                <View style={styles.amountLine}>
                  <Text>Subtotal:</Text>
                  <Text>₹{parseFloat(quote.subTotal || 0).toFixed(2)}</Text>
                </View>
                <View style={styles.amountLine}>
                  <Text>SGST:</Text>
                  <Text>₹{sgstTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.amountLine}>
                  <Text>CGST:</Text>
                  <Text>₹{cgstTotal.toFixed(2)}</Text>
                </View>
                <View style={[styles.amountLine, styles.amountTotal]}>
                  <Text>Total:</Text>
                  <Text>₹{(parseFloat(quote.subTotal || 0) + sgstTotal + cgstTotal).toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Authorized Signature and Stamp */}
            <View style={styles.signature}>
              <Text style={styles.signatureText}>Authorized Signature</Text>
              <Image src={stamp} style={styles.stamp} />
            </View>
          </View>

          {/* Bank Details */}
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.bankDetails}>
            <Text style={styles.bankDetailLine}>Account Number: 97138100000209</Text>
            <Text style={styles.bankDetailLine}>IFSC Code: BARB0DBBLUC</Text>
            <Text style={styles.bankDetailLine}>MICR Code: 226012055</Text>
          </View>

          {/* Terms and Conditions */}
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          <Text>1. Payment due within 30 days.</Text>
          <Text>2. All services subject to terms at www.webbiify.com.</Text>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text>Webbify Infotech | www.webbiify.com</Text>
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
                    <td className="px-4 py-2">₹{parseFloat(quote.subTotal || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">₹{parseFloat(quote.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-2">{quote.status || 'N/A'}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <Link
                        to={`/quotations/edit/${quote._id}`}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(quote._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        Delete
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
    </div>
  );
};

export default Quotation;