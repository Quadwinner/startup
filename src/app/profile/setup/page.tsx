"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    mainGame: '',
    country: '',
    state: '',
    city: '',
    experienceLevel: 'beginner'
  });
  
  // Check authentication status
  useEffect(() => {
    if (status === 'authenticated' && session) {
      setLoading(false);
    } else if (status === 'unauthenticated') {
      router.push('/login?redirect=/profile/setup');
    }
  }, [session, status, router]);
  
  // Check if username is available when it changes
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      
      try {
        setCheckingUsername(true);
        console.log('Checking username availability for:', formData.username);
        const response = await axios.get(`/api/profile/username-check?username=${encodeURIComponent(formData.username)}`);
        console.log('Username check response:', response.data);
        setUsernameAvailable(response.data.available);
      } catch (err) {
        console.error('Error checking username availability:', err);
        console.error('Error response:', err.response?.data);
        
        // Default to unavailable if there's an error, but don't show an error message
        setUsernameAvailable(false);
        
        // Don't set error here to avoid disrupting the form flow
        // if it's just a username check issue
      } finally {
        setCheckingUsername(false);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      if (formData.username) {
        checkUsername();
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [formData.username]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (error) {
      setError(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username) {
      setError('Username is required');
      toast.error('Username is required');
      return;
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      toast.error('Username must be at least 3 characters');
      return;
    }
    
    if (!usernameAvailable) {
      setError('This username is already taken. Please choose another one.');
      toast.error('This username is already taken');
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('Submitting profile with data:', formData);
      const response = await axios.post('/api/profile', formData);
      console.log('Profile created successfully:', response.data);
      setSuccessMessage('Profile created successfully!');
      toast.success('Profile created successfully!');
      
      // Redirect to profile page after short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating profile:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || err.response?.data?.details
        || 'Failed to create profile. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div 
          className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 md:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
              <p className="text-gray-400">Set up your Epic Esports India profile to join tournaments and connect with other gamers</p>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block mb-2 font-medium">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Choose a unique username"
                      required
                      minLength={3}
                      maxLength={20}
                    />
                    {checkingUsername && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="h-5 w-5 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                    {!checkingUsername && formData.username.length >= 3 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {usernameAvailable ? (
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    This will be your public username and cannot be changed later
                  </p>
                </div>
                
                {/* Display Name */}
                <div>
                  <label htmlFor="displayName" className="block mb-2 font-medium">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your preferred display name"
                    maxLength={30}
                  />
                </div>
                
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block mb-2 font-medium">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tell us about yourself as a gamer"
                    rows={4}
                    maxLength={250}
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-400">
                    {formData.bio.length}/250 characters
                  </p>
                </div>
                
                {/* Main Game */}
                <div>
                  <label htmlFor="mainGame" className="block mb-2 font-medium">
                    Main Game
                  </label>
                  <select
                    id="mainGame"
                    name="mainGame"
                    value={formData.mainGame}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select your main game</option>
                    <option value="Valorant">Valorant</option>
                    <option value="BGMI">BGMI</option>
                    <option value="Free Fire">Free Fire</option>
                    <option value="Call of Duty Mobile">Call of Duty Mobile</option>
                    <option value="FIFA">FIFA</option>
                    <option value="Fortnite">Fortnite</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Experience Level */}
                <div>
                  <label htmlFor="experienceLevel" className="block mb-2 font-medium">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                {/* Location Fields (Country, State, City) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="country" className="block mb-2 font-medium">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block mb-2 font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="State/Province"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block mb-2 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your city"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting || checkingUsername || !usernameAvailable}
                    className={`w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg ${
                      submitting || checkingUsername || (formData.username.length >= 3 && !usernameAvailable)
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-orange-600'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Creating Profile...
                      </span>
                    ) : (
                      'Create Profile'
                    )}
                  </button>
                </div>
                
                <div className="text-center text-gray-400 text-sm">
                  <p>
                    By creating a profile, you agree to our{' '}
                    <Link href="/terms" className="text-orange-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-orange-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 