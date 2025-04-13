"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  bio?: string;
  mainGame?: string;
  country?: string;
  state?: string;
  city?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  experienceLevel?: string;
  achievements?: any[];
  totalTournaments: number;
  tournamentsWon: number;
  totalMatches: number;
  matchesWon: number;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    mainGame: '',
    country: '',
    state: '',
    city: '',
    experienceLevel: 'beginner',
    avatarUrl: '',
    bannerUrl: '',
    socialLinks: [] as { platform: string; url: string }[]
  });

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/profile');
        const profileData = response.data.profile;
        setProfile(profileData);
        
        // Initialize form with existing profile data
        setFormData({
          displayName: profileData.displayName || '',
          bio: profileData.bio || '',
          mainGame: profileData.mainGame || '',
          country: profileData.country || '',
          state: profileData.state || '',
          city: profileData.city || '',
          experienceLevel: profileData.experienceLevel || 'beginner',
          avatarUrl: profileData.avatarUrl || '',
          bannerUrl: profileData.bannerUrl || '',
          socialLinks: profileData.socialLinks || []
        });
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        
        if (err.response?.status === 404 && err.response?.data?.needsSetup) {
          // Redirect to profile setup if needed
          router.push('/profile/setup');
          return;
        }
        
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated' && session) {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      router.push('/login?redirect=/profile/edit');
    }
  }, [session, status, router]);
  
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

  // Handle social link changes
  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };

  // Add new social link
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  };

  // Remove social link
  const removeSocialLink = (index: number) => {
    const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const response = await axios.post('/api/profile', formData);
      
      setSuccessMessage('Profile updated successfully!');
      toast.success('Profile updated!');
      
      // Redirect to profile page after short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading profile data...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Profile not found</div>
        <Link href="/profile/setup" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
          Create Profile
        </Link>
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
              <h1 className="text-3xl font-bold mb-2">Edit Your Profile</h1>
              <p className="text-gray-400">Update your Epic Esports India profile information</p>
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
                {/* Username (read-only) */}
                <div>
                  <label htmlFor="username" className="block mb-2 font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={profile.username}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400"
                    disabled
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    Username cannot be changed
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
                    <option value="CSGO">CS:GO</option>
                    <option value="Fortnite">Fortnite</option>
                    <option value="League of Legends">League of Legends</option>
                    <option value="Dota 2">Dota 2</option>
                    <option value="Apex Legends">Apex Legends</option>
                    <option value="Call of Duty">Call of Duty</option>
                    <option value="Free Fire">Free Fire</option>
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
                
                {/* Location */}
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
                      placeholder="Country"
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
                      placeholder="State"
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
                      placeholder="City"
                    />
                  </div>
                </div>
                
                {/* Avatar & Banner URLs */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="avatarUrl" className="block mb-2 font-medium">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      id="avatarUrl"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    {formData.avatarUrl && (
                      <div className="mt-2 flex items-center">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-600 mr-2">
                          <Image 
                            src={formData.avatarUrl}
                            alt="Avatar preview"
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/48";
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">Preview</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bannerUrl" className="block mb-2 font-medium">
                      Banner URL
                    </label>
                    <input
                      type="url"
                      id="bannerUrl"
                      name="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://example.com/banner.jpg"
                    />
                    {formData.bannerUrl && (
                      <div className="mt-2">
                        <div className="h-24 w-full rounded-lg overflow-hidden bg-gray-600">
                          <Image 
                            src={formData.bannerUrl}
                            alt="Banner preview"
                            width={400}
                            height={100}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/400x100";
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">Preview</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Social Links */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">Social Links</label>
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="text-sm text-orange-400 hover:text-orange-300 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Link
                    </button>
                  </div>
                  
                  {formData.socialLinks.length === 0 ? (
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-6 text-center text-gray-400">
                      <p>No social links added. Click "Add Link" to connect your social profiles.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <select
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                            className="w-1/3 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Platform</option>
                            <option value="twitter">Twitter</option>
                            <option value="twitch">Twitch</option>
                            <option value="youtube">YouTube</option>
                            <option value="discord">Discord</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="website">Website</option>
                          </select>
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialLink(index)}
                            className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30"
                            aria-label="Remove link"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className={`bg-orange-500 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-orange-600 transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <Link
                    href="/profile"
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-600 transition"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 