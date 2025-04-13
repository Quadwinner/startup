"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-2xl font-bold">
              EpicEsports India
            </Link>
            <motion.span 
              className="text-sm bg-orange-500 text-white px-2 py-1 rounded-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              BETA
            </motion.span>
          </motion.div>
          
          <motion.nav 
            className="hidden md:flex space-x-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link href="/" className="hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/games" className="hover:text-orange-400 transition-colors">
              Games
            </Link>
            <Link href="/tournaments" className="hover:text-orange-400 transition-colors">
              Tournaments
            </Link>
            <Link href="/events" className="hover:text-orange-400 transition-colors">
              Events
            </Link>
            <Link href="/community" className="hover:text-orange-400 transition-colors">
              Community
            </Link>
            <Link href="/performance" className="hover:text-orange-400 transition-colors">
              Performance
            </Link>
            <Link href="/leaderboard" className="hover:text-orange-400 transition-colors">
              Leaderboard
            </Link>
            <Link href="/careers" className="hover:text-orange-400 transition-colors">
              Careers
            </Link>
            <Link href="/about" className="hover:text-orange-400 transition-colors">
              About
            </Link>
          </motion.nav>
          
          <div className="flex items-center space-x-3">
            {session ? (
              <div className="relative">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 bg-slate-800 text-white px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
                >
                  <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline">{session.user?.name?.split(' ')[0] || 'User'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-20">
                    <Link href="/member" className="block px-4 py-2 text-sm text-gray-200 hover:bg-slate-700">
                      Member Dashboard
                    </Link>
                    
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-200 hover:bg-slate-700">
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-200 hover:bg-slate-700">
                      Account Settings
                    </Link>
                    
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/login" 
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign In
                </Link>
              </motion.div>
            )}
            <button 
              className="md:hidden"
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Toggle based on state */}
        <motion.div 
          className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-3">
            <Link href="/" className="block hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/games" className="block hover:text-orange-400 transition-colors">
              Games
            </Link>
            <Link href="/tournaments" className="block hover:text-orange-400 transition-colors">
              Tournaments
            </Link>
            <Link href="/events" className="block hover:text-orange-400 transition-colors">
              Events
            </Link>
            <Link href="/community" className="block hover:text-orange-400 transition-colors">
              Community
            </Link>
            <Link href="/performance" className="block hover:text-orange-400 transition-colors">
              Performance
            </Link>
            <Link href="/leaderboard" className="block hover:text-orange-400 transition-colors">
              Leaderboard
            </Link>
            <Link href="/careers" className="block hover:text-orange-400 transition-colors">
              Careers
            </Link>
            <Link href="/about" className="block hover:text-orange-400 transition-colors">
              About
            </Link>
            {session ? (
              <>
                <Link href="/member" className="block hover:text-orange-400 transition-colors">
                  Member Dashboard
                </Link>
                {session.user?.role === 'admin' && (
                  <Link href="/admin" className="block hover:text-orange-400 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="block text-left text-red-400 hover:text-red-300 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block hover:text-orange-400 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header; 