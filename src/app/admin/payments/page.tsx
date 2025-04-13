"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Simulated mock data
  useEffect(() => {
    const mockPayments = [
      {
        id: 'PAY-1234567',
        teamName: 'Team Phoenix',
        tournamentName: 'Valorant Championship 2025',
        amount: 1000,
        currency: '₹',
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2025-03-15T10:30:45',
        playerEmail: 'teamcaptain@phoenix.com',
        playerName: 'Rahul Sharma',
      },
      {
        id: 'PAY-7654321',
        teamName: 'Gaming Legends',
        tournamentName: 'BGMI Pro League Season 3',
        amount: 1500,
        currency: '₹',
        status: 'completed',
        paymentMethod: 'UPI',
        date: '2025-03-18T14:22:10',
        playerEmail: 'captain@gaminglegends.com',
        playerName: 'Vikram Singh',
      },
      {
        id: 'PAY-9876543',
        teamName: 'Digital Warriors',
        tournamentName: 'Valorant Championship 2025',
        amount: 1000,
        currency: '₹',
        status: 'completed',
        paymentMethod: 'Net Banking',
        date: '2025-03-19T09:15:30',
        playerEmail: 'team@digitalwarriors.com',
        playerName: 'Priya Patel',
      },
      {
        id: 'PAY-3456789',
        teamName: 'Elite Gamers',
        tournamentName: 'BGMI Pro League Season 3',
        amount: 1500,
        currency: '₹',
        status: 'failed',
        paymentMethod: 'Credit Card',
        date: '2025-03-20T16:45:12',
        playerEmail: 'admin@elitegamers.com',
        playerName: 'Aman Gupta',
      },
      {
        id: 'PAY-5678901',
        teamName: 'Neon eSports',
        tournamentName: 'FIFA Online Tournament',
        amount: 500,
        currency: '₹',
        status: 'refunded',
        paymentMethod: 'UPI',
        date: '2025-03-10T11:20:35',
        playerEmail: 'contact@neonesports.com',
        playerName: 'Rohan Joshi',
      },
    ];
    
    setTimeout(() => {
      setPayments(mockPayments);
      setTotalRevenue(mockPayments.filter(p => p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0));
      setIsLoading(false);
    }, 1000);
  }, []);

  // If still loading the session
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/admin/payments');
    return null;
  }

  // Check if user has admin role, otherwise redirect to home
  if (session?.user?.role !== 'admin') {
    router.push('/');
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p>Access denied. Redirecting to home page...</p>
      </div>
    );
  }

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-200';
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      case 'failed':
        return 'bg-red-900 text-red-200';
      case 'refunded':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredPayments = payments.filter(payment => {
    // Filter by date range
    if (selectedDateRange !== 'all') {
      const paymentDate = new Date(payment.date);
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      
      if (selectedDateRange === 'week' && paymentDate < weekAgo) {
        return false;
      }
      
      if (selectedDateRange === 'month' && paymentDate < monthAgo) {
        return false;
      }
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        payment.id.toLowerCase().includes(query) ||
        payment.teamName.toLowerCase().includes(query) ||
        payment.tournamentName.toLowerCase().includes(query) ||
        payment.playerName.toLowerCase().includes(query) ||
        payment.playerEmail.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="bg-slate-900 min-h-screen text-white p-8">
      <div className="mb-8">
        <Link href="/admin" className="text-orange-400 hover:text-orange-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Admin Dashboard
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-8">Payments Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-blue-600 rounded-lg p-6 text-white shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <h3 className="text-lg font-medium opacity-80">Total Revenue</h3>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-green-600 rounded-lg p-6 text-white shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <h3 className="text-lg font-medium opacity-80">Successful Payments</h3>
              <p className="text-2xl font-bold">{payments.filter(p => p.status === 'completed').length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-red-600 rounded-lg p-6 text-white shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">❌</div>
            <div>
              <h3 className="text-lg font-medium opacity-80">Failed Payments</h3>
              <p className="text-2xl font-bold">{payments.filter(p => p.status === 'failed').length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-purple-600 rounded-lg p-6 text-white shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">↩️</div>
            <div>
              <h3 className="text-lg font-medium opacity-80">Refunded Payments</h3>
              <p className="text-2xl font-bold">{payments.filter(p => p.status === 'refunded').length}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-slate-800 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search by payment ID, team, tournament, or player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="bg-slate-700 border border-slate-600 text-white py-2 px-3 rounded w-full"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDateRange('all');
              }}
              className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Payments Table */}
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <p className="text-xl text-gray-400">No payments found matching your filters.</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team / Player
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tournament
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{payment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">{payment.teamName}</div>
                        <div className="text-sm text-gray-400">{payment.playerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{payment.tournamentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{payment.currency}{payment.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{formatDate(payment.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewReceipt(payment)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Receipt
                      </button>
                      
                      {payment.status === 'completed' && (
                        <button className="text-purple-400 hover:text-purple-300 mr-3">
                          Refund
                        </button>
                      )}
                      
                      <button className="text-orange-400 hover:text-orange-300">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <motion.div 
            className="bg-slate-800 rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Payment Receipt</h2>
              <button 
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-slate-700 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">EpicEsports India</h3>
                  <p className="text-gray-400 text-sm">Tournament Registration Payment</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="border-b border-slate-600 pb-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Payment ID</p>
                    <p className="font-medium">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="font-medium">{formatDate(selectedPayment.date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-slate-600 pb-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Team Information</p>
                <p className="font-medium mb-1">{selectedPayment.teamName}</p>
                <p className="text-sm">{selectedPayment.playerName}</p>
                <p className="text-sm">{selectedPayment.playerEmail}</p>
              </div>
              
              <div className="border-b border-slate-600 pb-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Tournament</p>
                <p className="font-medium">{selectedPayment.tournamentName}</p>
              </div>
              
              <div className="border-b border-slate-600 pb-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Payment Method</p>
                <p className="font-medium">{selectedPayment.paymentMethod}</p>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold">
                <p>Total Amount</p>
                <p>{selectedPayment.currency}{selectedPayment.amount.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 