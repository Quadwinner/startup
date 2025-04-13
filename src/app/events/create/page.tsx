"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createEvent } from '@/lib/supabase';

export default function CreateEventPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'tournament',
    date: '',
    location: '',
    description: '',
    bannerImage: '/images/events-bg.jpg',
    ticketPrice: '',
    vipTicketPrice: '',
    maxAttendees: '',
    organizer: 'Epic Esports',
    isPublic: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare the data for submission
      const eventData = {
        ...formData,
        // Convert numeric fields
        ticketPrice: formData.ticketPrice ? parseInt(formData.ticketPrice) : 0,
        vipTicketPrice: formData.vipTicketPrice ? parseInt(formData.vipTicketPrice) : 0,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        // Add default fields
        createdAt: new Date().toISOString(),
        highlights: [],
        schedule: [],
        faqs: []
      };
      
      const response = await createEvent(eventData);
      console.log('Event created:', response);
      
      // Redirect to the event page
      router.push(`/events/${response.id}`);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-slate-900 text-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <Link href="/events" className="text-orange-500 hover:text-orange-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Events
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-slate-800 rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Event Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                    required
                  />
                </div>
                
                {/* Type */}
                <div>
                  <label className="block text-gray-300 mb-2">Event Type*</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                    required
                  >
                    <option value="tournament">Tournament</option>
                    <option value="workshop">Workshop</option>
                    <option value="community">Community Meetup</option>
                    <option value="expo">Expo</option>
                    <option value="career">Career Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-gray-300 mb-2">Event Date*</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="e.g., May 15-20, 2023"
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                    required
                  />
                </div>
                
                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Event Location*</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Delhi University, Delhi"
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Event Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                    required
                  ></textarea>
                </div>
                
                {/* Banner Image */}
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Banner Image URL</label>
                  <input
                    type="text"
                    name="bannerImage"
                    value={formData.bannerImage}
                    onChange={handleInputChange}
                    placeholder="/images/events-bg.jpg"
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                  />
                  <p className="text-gray-400 text-sm mt-1">Leave default for a placeholder image</p>
                </div>
                
                {/* Ticket Price */}
                <div>
                  <label className="block text-gray-300 mb-2">Standard Ticket Price (₹)</label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 500 (leave empty for free)"
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                  />
                </div>
                
                {/* VIP Ticket Price */}
                <div>
                  <label className="block text-gray-300 mb-2">VIP Ticket Price (₹)</label>
                  <input
                    type="number"
                    name="vipTicketPrice"
                    value={formData.vipTicketPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000 (leave empty for free)"
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                  />
                </div>
                
                {/* Max Attendees */}
                <div>
                  <label className="block text-gray-300 mb-2">Maximum Attendees</label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    placeholder="e.g., 100 (leave empty for unlimited)"
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                  />
                </div>
                
                {/* Organizer */}
                <div>
                  <label className="block text-gray-300 mb-2">Organizer</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                  />
                </div>
                
                {/* Public/Private */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="w-5 h-5 bg-slate-700 border border-slate-600 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 text-gray-300">
                      Make this event public (visible to all users)
                    </label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">About Event Creation</h2>
            <p className="text-gray-300 mb-4">
              After creating your event, you'll be able to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li>Add detailed schedule information</li>
              <li>Set up event highlights</li>
              <li>Create FAQs for attendees</li>
              <li>Manage registrations and ticket sales</li>
              <li>Send updates to registered attendees</li>
            </ul>
            <p className="text-gray-300">
              These advanced features will be available from the event management dashboard after creating your event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 