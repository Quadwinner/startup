"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getEvents } from '@/lib/supabase';

// Define Event type to fix TypeScript errors
interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  image: string;
  bannerImage?: string;
  ticketPrice?: number;
  vipTicketPrice?: number;
  organizer?: string;
  isPublic?: boolean;
  highlights?: string[];
  schedule?: Array<{time: string, title: string, description: string}>;
  faqs?: Array<{question: string, answer: string}>;
}

export default function EventsPage() {
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const fetchedEvents = await getEvents();
        if (Array.isArray(fetchedEvents)) {
          // Make sure all required fields have default values
          const processedEvents = fetchedEvents.map(event => ({
            id: event.id || `temp-${Math.random().toString(36).substring(7)}`,
            title: event.title || 'Untitled Event',
            type: event.type || 'other',
            date: event.date || new Date().toISOString(),
            location: event.location || 'TBD',
            description: event.description || 'No description available',
            image: event.image || '/images/event-placeholder.jpg', // Fallback image
            ...event
          }));
          setEvents(processedEvents);
        } else {
          // If fetched events is not an array, set empty array
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);
  
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-800">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/events-bg.jpg"
            alt="Events background"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Upcoming Events</h1>
            <p className="text-xl text-gray-300">
              Join us at our tournaments, workshops, and community meetups happening across India
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 bg-slate-800 border-t border-b border-slate-700">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-colors ${filter === 'all' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              All Events
            </button>
            <button 
              onClick={() => setFilter('tournament')}
              className={`px-6 py-2 rounded-full transition-colors ${filter === 'tournament' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Tournaments
            </button>
            <button 
              onClick={() => setFilter('workshop')}
              className={`px-6 py-2 rounded-full transition-colors ${filter === 'workshop' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Workshops
            </button>
            <button 
              onClick={() => setFilter('community')}
              className={`px-6 py-2 rounded-full transition-colors ${filter === 'community' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Community
            </button>
            <button 
              onClick={() => setFilter('expo')}
              className={`px-6 py-2 rounded-full transition-colors ${filter === 'expo' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Expos
            </button>
            <button 
              onClick={() => setFilter('career')}
              className={`px-6 py-2 rounded-full transition-colors ${filter === 'career' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
            >
              Career Events
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Events List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-2xl font-bold mb-2">Error Loading Events</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div 
                  key={event.id}
                  className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -10 }}
                >
                  <div className="h-48 relative">
                    <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 z-10 rounded-bl-lg">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </div>
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="bg-slate-700 h-full w-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <div className="flex items-center text-gray-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href={`/events/${event.id}`} className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                        View Details
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredEvents.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-2xl font-bold mb-2">No events found</h3>
              <p className="text-gray-400">There are no upcoming events in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Calendar Integration CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Never Miss an Event!</h2>
              <p className="text-lg">
                Subscribe to our events calendar to stay updated with all the upcoming tournaments, workshops and meetups.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <motion.button 
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Google Calendar
              </motion.button>
              <motion.button 
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Apple Calendar
              </motion.button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Host an Event CTA */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-lg p-8 md:p-12 border border-slate-700">
            <div className="md:flex items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-4">Want to host your own event?</h2>
                <p className="text-gray-300 mb-6">
                  If you're a gaming organization, university, or company looking to host an esports event, 
                  we can help with planning, promotion, and execution.
                </p>
                <Link 
                  href="/events/create"
                  className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Create an Event
                </Link>
              </div>
              <div className="md:w-1/3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-full text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 