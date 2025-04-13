"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-300">
              Last updated: April 13, 2025
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg p-8 shadow-lg">
            <div className="prose prose-lg prose-invert max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="mb-6">
                  Welcome to EpicEsports India. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you how we look after your personal data when you visit our website and 
                  tell you about your privacy rights and how the law protects you.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">2. The Data We Collect About You</h2>
                <p className="mb-4">
                  Personal data means any information about an individual from which that person can be identified. 
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">Identity Data: includes first name, last name, username or similar identifier, and date of birth.</li>
                  <li className="mb-2">Contact Data: includes email address, phone number, and address.</li>
                  <li className="mb-2">Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform.</li>
                  <li className="mb-2">Profile Data: includes your username and password, tournament registrations, preferences, feedback, and survey responses.</li>
                  <li className="mb-2">Usage Data: includes information about how you use our website and services.</li>
                </ul>
                
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Personal Data</h2>
                <p className="mb-4">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">To register you as a new customer.</li>
                  <li className="mb-2">To process and deliver tournament registrations.</li>
                  <li className="mb-2">To manage our relationship with you.</li>
                  <li className="mb-2">To make suggestions and recommendations to you about events or services that may be of interest to you.</li>
                  <li className="mb-2">To provide you with our newsletter, if you have subscribed to it.</li>
                </ul>
                
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="mb-6">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or 
                  accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those 
                  employees, agents, contractors, and other third parties who have a business need to know.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
                <p className="mb-6">
                  We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
                  including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">6. Your Legal Rights</h2>
                <p className="mb-4">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">Request access to your personal data.</li>
                  <li className="mb-2">Request correction of your personal data.</li>
                  <li className="mb-2">Request erasure of your personal data.</li>
                  <li className="mb-2">Object to processing of your personal data.</li>
                  <li className="mb-2">Request restriction of processing your personal data.</li>
                  <li className="mb-2">Request transfer of your personal data.</li>
                  <li className="mb-2">Right to withdraw consent.</li>
                </ul>
                
                <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
                <p className="mb-6">
                  Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good 
                  experience when you browse our website and also allows us to improve our site.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">8. Changes to This Privacy Policy</h2>
                <p className="mb-6">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy 
                  policy on this page and updating the "Last updated" date at the top of this policy.
                </p>
                
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <p className="mb-6">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                  <br /><br />
                  Email: <a href="mailto:shubhamkush012@gmail.com" className="text-orange-400 hover:text-orange-300">shubhamkush012@gmail.com</a>
                  <br />
                  Phone: +91 8824013820
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Links */}
      <section className="py-12 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Related Legal Information</h2>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link 
                href="/terms-and-conditions"
                className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-6 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">Terms & Conditions</h3>
                <p className="text-gray-300">
                  Read our terms of service and user agreement.
                </p>
              </Link>
              <Link 
                href="/contact"
                className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-6 text-center"
              >
                <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-300">
                  Have questions about our privacy practices? Get in touch.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
