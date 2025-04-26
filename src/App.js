import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import CustomerForm from './components/CustomerForm';
import Quotation from './components/Quotation';
import QuotationForm from './components/QuotationForm';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return token ? children : null;
};

const App = () => {
  return (
    <div className="flex">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Sidebar />
              <div className="flex-1 ml-0 md:ml-64">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/new" element={<CustomerForm />} />
                  <Route path="/quotations" element={<Quotation />} />
                  <Route path="/quotations/new" element={<QuotationForm />} />
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;