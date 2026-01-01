// client/src/pages/Contact.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import { Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="text-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h1>
            <p className="text-sm text-gray-500">We usually respond within 24 hours.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                    <Mail className="w-6 h-6 mx-auto mb-3 text-gray-900" />
                    <h3 className="text-sm font-bold text-gray-900">Email Us</h3>
                    <p className="text-xs text-gray-500 mt-1">support@babualearning.com</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                    <MessageSquare className="w-6 h-6 mx-auto mb-3 text-gray-900" />
                    <h3 className="text-sm font-bold text-gray-900">Community</h3>
                    <p className="text-xs text-gray-500 mt-1">Join our Discord</p>
                </div>
            </div>

            {/* Simple Form */}
            <div className="md:col-span-2 bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" className="w-full p-3 rounded-lg bg-gray-50 border-none text-sm focus:ring-1 focus:ring-gray-900" />
                        <input type="email" placeholder="Email" className="w-full p-3 rounded-lg bg-gray-50 border-none text-sm focus:ring-1 focus:ring-gray-900" />
                    </div>
                    <input type="text" placeholder="Subject" className="w-full p-3 rounded-lg bg-gray-50 border-none text-sm focus:ring-1 focus:ring-gray-900" />
                    <textarea rows="4" placeholder="Message" className="w-full p-3 rounded-lg bg-gray-50 border-none text-sm focus:ring-1 focus:ring-gray-900"></textarea>
                    
                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition w-full md:w-auto">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;