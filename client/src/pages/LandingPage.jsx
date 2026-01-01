import React from 'react';
import Navbar from '../components/Navbar'; 
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero-student.png';
import { useAuth } from '../context/AuthContext'; // 🔥 Step 1: Auth Import kiya

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 🔥 Step 2: User status check

  const skills = [
    { name: 'DSA', highlighted: true },
    { name: 'System Design', highlighted: true },
    { name: 'DBMS', highlighted: false },
    { name: 'AIML', highlighted: false },
    { name: 'Computer Networks', highlighted: false },
    { name: 'LLD', highlighted: true },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <main className="relative max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-20">
        <div className="absolute top-0 right-0 w-3/4 h-[90%] bg-pink-50 -z-10 rounded-bl-[150px] translate-x-1/4"></div>

        <div className="relative z-0 mt-8 mb-8 text-center md:text-left">
              <h1 className="text-[12vw] md:text-[130px] font-black text-gray-900 leading-none uppercase tracking-tighter select-none opacity-90">
                BABUA LEARNING
            </h1>
            
            <div className="mt-6 flex flex-col items-center md:items-start animate-in slide-in-from-left duration-700">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Top Skills</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start max-w-3xl">
                    {skills.map((skill, index) => (
                      <span key={index} className={`px-4 py-1.5 rounded-full text-xs font-bold border tracking-wide transition hover:-translate-y-0.5 ${skill.highlighted ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 shadow-sm'}`}>
                        {skill.name}
                      </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center relative z-10">
          <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-12 md:mb-0 mt-8">
            <div className="bg-pink-100/90 p-8 rounded-3xl backdrop-blur-sm border border-pink-200 relative shadow-sm hover:shadow-md transition duration-300">
              <p className="text-lg text-gray-800 font-medium leading-relaxed mb-8">
                Focused on real engineering growth. No-nonsense, practical learning driven by community. We don't sell certificates; we build capabilities.
              </p>
              
              {/* 🔥 Step 3: Button Logic Updated */}
              <div className="flex flex-wrap gap-4">
                
                {user ? (
                    // CASE 1: AGAR USER LOGGED IN HAI -> "Start Learning"
                    <button 
                        onClick={() => navigate('/courses')} 
                        className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                    >
                        Start Learning
                    </button>
                ) : (
                    // CASE 2: AGAR USER LOGGED OUT HAI -> "Login / Signup"
                    <>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                        >
                            Login Now
                        </button>
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold border-2 border-gray-900 hover:bg-gray-50 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 active:scale-95"
                        >
                            Signup
                        </button>
                    </>
                )}

              </div>

            </div>
          </div>

          <div className="w-full md:w-1/2 relative flex justify-center md:justify-end h-[400px] md:h-auto">
            <div className="relative z-20 md:-mt-[280px] md:-mr-10 pointer-events-none">
                <img src={heroImg} alt="Student" className="drop-shadow-2xl object-contain h-[400px] md:h-[700px] w-auto" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;