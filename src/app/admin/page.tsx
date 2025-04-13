"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching users data
  useEffect(() => {
    // In a real app, you would fetch from your API
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com', role: 'member', joinDate: '2023-01-15' },
      { id: 2, name: 'User 2', email: 'user2@example.com', role: 'admin', joinDate: '2023-02-20' },
      { id: 3, name: 'User 3', email: 'user3@example.com', role: 'member', joinDate: '2023-03-10' },
      { id: 4, name: 'User 4', email: 'user4@example.com', role: 'member', joinDate: '2023-04-05' },
      { id: 5, name: 'User 5', email: 'user5@example.com', role: 'member', joinDate: '2023-05-12' },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
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
    router.push('/login?callbackUrl=/admin');
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

  // Stats cards for the dashboard
  const statsCards = [
    { title: 'Total Users', value: '1,234', icon: '👥', color: 'bg-blue-500' },
    { title: 'Active Tournaments', value: '12', icon: '🏆', color: 'bg-green-500' },
    { title: 'Monthly Revenue', value: '₹42,500', icon: '💰', color: 'bg-purple-500' },
    { title: 'New Members (30d)', value: '152', icon: '📈', color: 'bg-orange-500' },
  ];

  // Recent activities for the dashboard
  const recentActivities = [
    { id: 1, action: 'New user registered', user: 'Raj Patel', time: '10 minutes ago' },
    { id: 2, action: 'Tournament created', user: 'Admin', time: '2 hours ago' },
    { id: 3, action: 'Payment received', user: 'Ankita Sharma', time: '5 hours ago' },
    { id: 4, action: 'User role updated', user: 'Admin', time: '1 day ago' },
    { id: 5, action: 'New team registered', user: 'TeamXForce', time: '2 days ago' },
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <div className="flex">
        {/* Sidebar */}
        <motion.div 
          className="w-64 bg-slate-800 min-h-screen p-4 hidden md:block"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-400">Admin Panel</h2>
            <p className="text-sm text-gray-400">Manage your platform</p>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${activeTab === 'dashboard' ? 'bg-slate-700 text-orange-400' : 'hover:bg-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab('users')} 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${activeTab === 'users' ? 'bg-slate-700 text-orange-400' : 'hover:bg-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              User Management
            </button>
            
            <Link 
              href="/admin/tournaments"
              className="w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Tournament Management
            </Link>
            
            <Link 
              href="/admin/payments"
              className="w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Payment Management
            </Link>
            
            <button 
              onClick={() => setActiveTab('events')} 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${activeTab === 'events' ? 'bg-slate-700 text-orange-400' : 'hover:bg-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Event Management
            </button>
            
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center ${activeTab === 'settings' ? 'bg-slate-700 text-orange-400' : 'hover:bg-slate-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </nav>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <Link 
              href="/"
              className="w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Site
            </Link>
          </div>
        </motion.div>
        
        {/* Mobile Nav */}
        <div className="md:hidden bg-slate-800 p-4 w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-orange-400">Admin Panel</h2>
            <div className="relative">
              <select 
                value={activeTab}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'tournaments') {
                    router.push('/admin/tournaments');
                  } else if (value === 'payments') {
                    router.push('/admin/payments');
                  } else {
                    setActiveTab(value);
                  }
                }}
                className="bg-slate-700 border border-slate-600 text-white py-2 px-4 pr-8 rounded appearance-none"
              >
                <option value="dashboard">Dashboard</option>
                <option value="users">Users</option>
                <option value="tournaments">Tournaments</option>
                <option value="payments">Payments</option>
                <option value="events">Events</option>
                <option value="settings">Settings</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, index) => (
                  <motion.div 
                    key={index}
                    className={`${card.color} rounded-lg p-6 text-white shadow-lg`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">{card.icon}</div>
                      <div>
                        <h3 className="text-lg font-medium opacity-80">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Recent Activity */}
              <div className="bg-slate-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start border-b border-slate-700 pb-3 last:border-0 last:pb-0">
                      <div className="bg-slate-700 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <div className="flex justify-between mt-1 text-sm text-gray-400">
                          <span>{activity.user}</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/admin/tournaments" className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors text-center">
                      Create Tournament
                    </Link>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                      Add New User
                    </button>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors">
                      Post Announcement
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-bold mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Server Load</span>
                      <div className="w-2/3 bg-slate-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full w-1/4"></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database Usage</span>
                      <div className="w-2/3 bg-slate-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full w-2/5"></div>
                      </div>
                      <span className="text-sm">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Calls</span>
                      <div className="w-2/3 bg-slate-700 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full w-1/3"></div>
                      </div>
                      <span className="text-sm">33%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* User Management */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add User
                </button>
              </div>
              
              {/* Search and Filter */}
              <div className="bg-slate-800 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Search users..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <select className="bg-slate-700 border border-slate-600 text-white py-2 px-3 rounded">
                      <option value="">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                    <select className="bg-slate-700 border border-slate-600 text-white py-2 px-3 rounded">
                      <option value="">Sort By</option>
                      <option value="name">Name</option>
                      <option value="date">Join Date</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Users Table */}
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map((user: any) => (
                          <tr key={user.id} className="hover:bg-slate-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-slate-600 rounded-full flex items-center justify-center text-xl">
                                  {user.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.joinDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-orange-400 hover:text-orange-300 mr-3">
                                Edit
                              </button>
                              <button className="text-red-500 hover:text-red-400">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'dashboard' && activeTab !== 'users' && (
            <div className="bg-slate-800 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
              <p className="text-gray-400 mb-6">This section is under development. Coming soon!</p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 