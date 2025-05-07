import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiUser, FiLogOut, FiDollarSign, FiUserPlus, FiCreditCard } from 'react-icons/fi';
import logo from '../components/Assests/Webbiify.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = { name: 'John Doe' }; // Placeholder user data
      setUserName(user.name || 'User');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden p-3 bg-gray-100 fixed top-0 left-0 z-50 text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      {/* Sidebar */}
      <aside
        className={`w-56 sm:w-64 bg-gray-100 h-screen p-4 fixed top-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 z-40`}
      >
        {/* Logo */}
        <div className="mb-6">
          <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
        </div>
        {/* User Section */}
        <div className="mb-6">
          <p className="text-sm sm:text-base font-semibold">Welcome, {userName}</p>
        </div>
        <nav>
          <ul>
            <li className="mb-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiHome className="mr-2 text-gray-600" />
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiUsers className="mr-2 text-gray-600" />
                Customers
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/quotations"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiFileText className="mr-2 text-gray-600" />
                Quotations
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiDollarSign className="mr-2 text-gray-600" />
                Payments
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiUserPlus className="mr-2 text-gray-600" />
                Leads
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiCreditCard className="mr-2 text-gray-600" />
                Expenses
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center p-2 bg-gray-200 rounded text-sm sm:text-base'
                    : 'flex items-center p-2 hover:bg-gray-200 rounded text-sm sm:text-base'
                }
                onClick={() => setIsOpen(false)}
              >
                <FiUser className="mr-2 text-gray-600" />
                Users
              </NavLink>
            </li>
            <li className="mb-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left p-2 hover:bg-gray-200 rounded text-sm sm:text-base"
              >
                <FiLogOut className="mr-2 text-gray-600" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;