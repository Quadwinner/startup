'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      setMessage(`Signup successful! Check email for confirmation: ${data.user?.email}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setMessage(`Login successful! User: ${data.user?.email}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Test Login Page</h1>
      
      {message && (
        <div className="bg-green-800/30 border border-green-500 p-4 rounded mb-6">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-800/30 border border-red-500 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-slate-800 p-6 rounded-lg mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-slate-700 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-slate-700 rounded"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
            
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 