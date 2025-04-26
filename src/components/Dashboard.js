import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Invoices</h2>
          <p className="text-xs sm:text-sm md:text-base">This Month: ₹200.00</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Quotes For Customers</h2>
          <p className="text-xs sm:text-sm md:text-base">This Month: ₹250.00</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Quotes For Leads</h2>
          <p className="text-xs sm:text-sm md:text-base">This Month: ₹0.00</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Unpaid</h2>
          <p className="text-xs sm:text-sm md:text-base">Not Paid: ₹200.00</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;