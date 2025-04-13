"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getEventById, registerForEvent, createEventTicket } from '@/lib/supabase';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  // Registration form state
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'standard'
  });
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Error loading event. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRegistration = async (e) => {
    e.preventDefault();
    setRegistering(true);
    
    try {
      // Register the user for the event
      const registrationData = {
        name: registrationForm.name,
        email: registrationForm.email,
        phone: registrationForm.phone,
        eventId: eventId,
        registrationDate: new Date().toISOString()
      };
      
      const result = await registerForEvent(eventId, registrationData);
      
      // Create a ticket for the registration
      const ticketData = {
        registrationId: result.registration.id,
        eventId: eventId,
        ticketType: registrationForm.ticketType,
        ticketNumber: `EPIC-${Date.now()}`,
        issuedDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      await createEventTicket(ticketData);
      
      setRegistrationSuccess(true);
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-lg mx-auto">
          <div className="text-red-500 text-5xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">{error}</h1>
          <p className="mb-6">We couldn't find the event you're looking for.</p>
          <Link href="/events" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Event not found</h1>
          <Link href="/events" className="text-orange-500 hover:text-orange-400">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }
  
  // Render success message after registration
  if (registrationSuccess) {
    return (
      <div className="bg-slate-900 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto p-8 bg-slate-800 rounded-xl shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
            <p className="text-xl mb-8">
              Thank you for registering for {event.title}. A confirmation email has been sent to {registrationForm.email}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Back to Events
              </Link>
              <Link href="/profile/tickets" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View My Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Event Header */}
      <div className="relative">
        <div className="h-80 md:h-96 relative">
          <Image
            src={event.bannerImage || "/images/events-bg.jpg"}
            alt={event.title}
            fill
            style={{ objectFit: "cover" }}
            className="brightness-50"
          />
          <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-2 z-10 rounded-bl-lg">
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="bg-slate-800 rounded-lg shadow-xl p-8 -mt-24 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-semibold">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <div>
                  <p className="text-gray-400 text-sm">Ticket Price</p>
                  <p className="font-semibold">₹{event.ticketPrice || 'Free'}</p>
                </div>
              </div>
            </div>
            
            {!showRegistrationForm && (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button 
                  onClick={() => setShowRegistrationForm(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Register Now
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Event Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="flex border-b border-slate-700">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-4 flex-1 text-center font-medium transition-colors ${activeTab === 'details' ? 'bg-slate-700 text-orange-500' : 'hover:bg-slate-700'}`}
                >
                  Event Details
                </button>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className={`px-6 py-4 flex-1 text-center font-medium transition-colors ${activeTab === 'schedule' ? 'bg-slate-700 text-orange-500' : 'hover:bg-slate-700'}`}
                >
                  Schedule
                </button>
                <button 
                  onClick={() => setActiveTab('faqs')}
                  className={`px-6 py-4 flex-1 text-center font-medium transition-colors ${activeTab === 'faqs' ? 'bg-slate-700 text-orange-500' : 'hover:bg-slate-700'}`}
                >
                  FAQs
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'details' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <p className="mb-4">{event.description}</p>
                    
                    {event.highlights && (
                      <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Event Highlights</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {event.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'schedule' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
                    {event.schedule ? (
                      <div className="space-y-6">
                        {event.schedule.map((item, index) => (
                          <div key={index} className="border-b border-slate-700 pb-4 mb-4 last:border-0">
                            <div className="flex items-start">
                              <div className="bg-orange-500 text-white text-lg font-bold rounded px-3 py-1 mr-4">
                                {item.time}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Schedule information will be updated soon.</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'faqs' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    {event.faqs ? (
                      <div className="space-y-6">
                        {event.faqs.map((faq, index) => (
                          <div key={index} className="border-b border-slate-700 pb-4 last:border-0">
                            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                            <p className="text-gray-300">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>FAQ information will be updated soon.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="lg:col-span-1">
            {showRegistrationForm ? (
              <motion.div 
                className="bg-slate-800 rounded-lg shadow-lg p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Register for Event</h2>
                
                <form onSubmit={handleRegistration}>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={registrationForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={registrationForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={registrationForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Ticket Type</label>
                    <select
                      name="ticketType"
                      value={registrationForm.ticketType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded bg-slate-700 border border-slate-600 text-white"
                    >
                      <option value="standard">Standard - ₹{event.ticketPrice || 'Free'}</option>
                      <option value="vip">VIP - ₹{event.vipTicketPrice || (event.ticketPrice ? event.ticketPrice * 2 : 'Free')}</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowRegistrationForm(false)}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded text-white font-medium transition-colors flex-1 flex justify-center items-center"
                    >
                      {registering ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-slate-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Event Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-500">Organizer</h3>
                    <p>{event.organizer || 'Epic Esports'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-orange-500">Category</h3>
                    <p>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                  </div>
                  
                  {event.maxAttendees && (
                    <div>
                      <h3 className="text-lg font-semibold text-orange-500">Maximum Attendees</h3>
                      <p>{event.maxAttendees}</p>
                    </div>
                  )}
                  
                  {event.sponsors && event.sponsors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-orange-500">Sponsors</h3>
                      <p>{event.sponsors.join(', ')}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-semibold mb-2">Share This Event</h3>
                  <div className="flex gap-4">
                    <button className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-400 rounded-full hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                      </svg>
                    </button>
                    <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                      <svg className="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"></path>
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-700 rounded-full hover:bg-blue-800 transition-colors">
                      <svg className="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Events */}
      <section className="bg-slate-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Similar Events You May Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, index) => (
              <div 
                key={index}
                className="bg-slate-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-48 relative">
                  <Image
                    src={`/images/events/event-${index + 1}.jpg`}
                    alt="Event"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Related Event {index + 1}</h3>
                  <div className="flex items-center text-gray-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Upcoming Date</span>
                  </div>
                  <Link href={`/events/${index + 10}`} className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 