import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-start space-x-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#2F80ED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Invoices</h2>
            <p className="text-xs sm:text-sm md:text-base">This Month: ₹200.00</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-start space-x-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#2F80ED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Quotes For Customers</h2>
            <p className="text-xs sm:text-sm md:text-base">This Month: ₹250.00</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-start space-x-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#2F80ED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Quotes For Leads</h2>
            <p className="text-xs sm:text-sm md:text-base">This Month: ₹0.00</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex items-start space-x-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#2F80ED] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 7V7m-9 7h18"></path>
          </svg>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Unpaid</h2>
            <p className="text-xs sm:text-sm md:text-base">Not Paid: ₹200.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;