import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, BookOpen, Trophy, CheckCircle, Bot, Sparkles, Mic, Languages, Lock, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [daysLeft, setDaysLeft] = useState(7);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/user-profile/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          calculateTrialDays(data.ai_trial_start);
        })
        .catch(err => console.error("Profile fetch error:", err));
    }
  }, [user]);

  const calculateTrialDays = (startDateStr) => {
    if (!startDateStr) {
        setDaysLeft(7); // Default if not started
        return;
    }
    const startDate = new Date(startDateStr);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) setDaysLeft(0);
    else setDaysLeft(7 - diffDays);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        {/* WELCOME HEADER */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : <User />}
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900">
                        Welcome, {user.user_metadata?.full_name || 'Engineer'}!
                    </h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition">
                <LogOut size={18} /> Logout
            </button>
        </div>

        {/* STATS SECTION */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-lg"><BookOpen size={24} /></div>
                    <span className="text-gray-500 text-sm font-bold uppercase">Active Courses</span>
                </div>
                <p className="text-4xl font-black text-gray-900">1</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Trophy size={24} /></div>
                    <span className="text-gray-500 text-sm font-bold uppercase">Total Rewards</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-gray-900">{profile?.coins || 0}</p>
                    <span className="text-sm font-bold text-yellow-600">Coins</span>
                </div>
            </div>
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                    <span className="text-gray-500 text-sm font-bold uppercase">Completed</span>
                </div>
                <p className="text-4xl font-black text-gray-900">{profile?.completedCount || 0}</p>
            </div>
        </div>

        {/* 🔥 NEW: AI MENTOR INFO CARD */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden shadow-2xl">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                
                {/* Left: Intro & Trial Status */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                            <Bot className="text-pink-400" size={28} />
                        </div>
                        <span className="bg-pink-500/20 text-pink-300 text-xs font-bold px-3 py-1 rounded-full border border-pink-500/30 uppercase tracking-wide">
                            AI Beta 2.0
                        </span>
                    </div>
                    <h2 className="text-3xl font-black mb-4">Meet Your Personal AI Mentor</h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        I am here to help you solve DSA doubts, design complex systems, and even prepare for interviews.
                        <br/>Look for the <span className="text-white font-bold">Bot Icon</span> at the bottom right to start chatting.
                    </p>
                    
                    {/* Trial Progress Bar */}
                    <div className="bg-white/10 p-6 rounded-2xl border border-white/10 max-w-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <Clock size={16} /> Free Trial Status
                            </span>
                            <span className={`text-sm font-bold ${daysLeft > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {daysLeft > 0 ? `${daysLeft} Days Remaining` : 'Expired'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${daysLeft > 0 ? 'bg-green-400' : 'bg-red-500'}`}
                                style={{ width: `${(daysLeft / 7) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Enjoy unrestricted access to all premium AI features for 7 days.
                        </p>
                    </div>
                </div>

                {/* Right: Feature Comparison */}
                <div className="flex-1 md:border-l border-white/10 md:pl-12">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-yellow-400" /> 
                        Why Upgrade after 7 Days?
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-300">
                                <Mic size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Mock Interviews</h4>
                                <p className="text-sm text-gray-400">Practice real-time voice interviews. (Locked after trial)</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-purple-500/20 p-2 rounded-lg text-purple-300">
                                <Languages size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">English Conversation</h4>
                                <p className="text-sm text-gray-400">Improve fluency with AI corrections. (Locked after trial)</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start gap-4">
                            <div className="bg-gray-700/50 p-2 rounded-lg text-gray-400">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Unlimited Doubts</h4>
                                <p className="text-sm text-gray-400">Basic DSA doubts remain free forever.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/premium')} 
                        className="mt-8 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                        <Lock size={16} /> View Premium Plans
                    </button>
                </div>
            </div>
        </div>

        {/* CONTINUE LEARNING SECTION */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/4 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                 <img src="https://cdn3d.iconscout.com/3d/premium/thumb/coding-book-2974917-2477348.png" className="h-24 w-auto object-contain" alt="DSA" />
            </div>
            <div className="flex-1 w-full">
                <div className="flex justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">DSA Pattern Wise</h3>
                    <span className="text-sm font-bold text-pink-600">{profile?.progress || 0}%</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${profile?.progress || 0}%` }}
                    ></div>
                </div>
                
                <p className="text-xs text-gray-500">
                    {profile?.completedCount || 0} Lessons Completed
                </p>
            </div>
            
            <button onClick={() => navigate('/courses/1')} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition w-full md:w-auto">
                Resume
            </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;