// client/src/pages/About.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Simple Header */}
        <div className="mb-12 border-l-4 border-gray-900 pl-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">About Us</h1>
            <p className="text-gray-500 text-sm">Redefining how engineering is taught.</p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Not just another LMS.</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Most platforms focus on selling you a piece of paper. We focus on what happens after you get the job. Our curriculum is designed by engineers, for engineers.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                   We believe in "No-Nonsense" learning. If it's not used in the industry, we don't teach it. Simple as that.
                </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Our Core Values</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-900 rounded-full"></span> Practical Implementation
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-900 rounded-full"></span> Community Review
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-900 rounded-full"></span> Open Source Contribution
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-900 rounded-full"></span> Sustainable Growth
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;