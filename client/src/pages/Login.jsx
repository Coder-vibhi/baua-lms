import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// Supabase Import
import { supabase } from '../supabaseClient';

const Login = () => {
  const navigate = useNavigate();

  // 1. State for Data & Loading
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Login Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Supabase se Login Check karo
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Agar sab sahi hai -> Dashboard par bhejo
      // (Alert hatakar seedha navigate kar rahe hain professional look ke liye)
      navigate('/dashboard'); 
      
    } catch (err) {
      setError(err.message); // E.g. "Invalid login credentials"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        
        {/* Left Side: Visual (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gray-900 text-white flex-col justify-center px-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-50"></div>
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Welcome back, Engineer.</h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    "The only way to do great work is to love what you do." <br/> Continue your learning journey.
                </p>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-white">
            <div className="w-full max-w-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Login</h3>
                <p className="text-xs text-gray-500 mb-8">Enter your credentials to access your account.</p>

                {/* ERROR MESSAGE BOX */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-4 border border-red-100 font-bold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition" 
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-xs font-semibold text-gray-700">Password</label>
                            <a href="#" className="text-xs text-gray-500 hover:text-gray-900">Forgot?</a>
                        </div>
                        <input 
                          type="password" 
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition" 
                        />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-black transition flex items-center justify-center gap-2 group disabled:bg-gray-400"
                    >
                        {loading ? 'Signing In...' : 'Sign In'} 
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition" />}
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-gray-500">
                    New here? <Link to="/signup" className="text-gray-900 font-bold hover:underline">Create an account</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;