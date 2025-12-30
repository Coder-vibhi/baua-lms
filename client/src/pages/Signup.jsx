import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
// Supabase Import
import { supabase } from '../supabaseClient'; 

const Signup = () => {
  const navigate = useNavigate();
  
  // 1. Data Store karne ke liye State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Input change hone par state update karo
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Signup Function (Main Logic)
  const handleSignup = async (e) => {
    e.preventDefault(); // Page reload roko
    setLoading(true);
    setError(null);

    try {
      // Supabase se User Create karo
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName, // Meta data mein naam save karo
          },
        },
      });

      if (error) throw error;

      // Agar success hua, toh Dashboard ya Login par bhejo
      alert("Account Created Successfully! 🎉");
      navigate('/login'); // Ya '/dashboard' agar auto-login chahiye
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        
        {/* Left Side: Visual */}
        <div className="hidden md:flex w-1/2 bg-gray-50 border-r border-gray-100 flex-col justify-center px-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Build Real Skills.</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-sm text-gray-600">No certificate selling, only growth.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-sm text-gray-600">Community driven engineering.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-sm text-gray-600">Direct mentorship access.</p>
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-white">
            <div className="w-full max-w-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Get Started</h3>
                <p className="text-xs text-gray-500 mb-8">Join the community of builders.</p>

                {/* ERROR MESSAGE DIKHAO */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-4 border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-gray-900 transition" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-gray-900 transition" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                        <input 
                          type="password" 
                          name="password"
                          required
                          minLength={6} // Supabase requires min 6 chars
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-gray-900 transition" 
                        />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-black transition mt-2 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-gray-500">
                    Already a member? <Link to="/login" className="text-gray-900 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;