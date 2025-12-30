import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Nayi Image URL (Study Theme)
  const courseHeroImg = "https://cdni.iconscout.com/illustration/premium/thumb/online-education-4328822-3599965.png";

  useEffect(() => {
    fetch('https://baua-lms.onrender.com/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* HERO SECTION - REPAIRED & SPACIOUS */}
      <div className="relative w-full bg-white pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
         
         {/* Background Subtle Gradient (No heavy blobs) */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 opacity-60"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gray-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>

         <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            
            {/* Left Content (Text) - More Breathing Room */}
            <div className="w-full md:w-1/2 flex flex-col items-start z-10">
                <div className="inline-block px-4 py-2 bg-pink-50 text-pink-600 font-bold rounded-full text-xs uppercase tracking-widest mb-6 border border-pink-100">
                    Premium Curriculum
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                    Start Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Engineering Journey
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-lg leading-relaxed font-medium">
                    Structured learning paths designed for clarity. Master Data Structures, System Design, and Core CS subjects without the noise.
                </p>

                {/* Search Bar / Action Area */}
                <div className="flex w-full max-w-md bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition">
                    <input 
                        type="text" 
                        placeholder="What do you want to learn?" 
                        className="flex-1 px-4 py-2 rounded-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-black transition">
                        Search
                    </button>
                </div>
            </div>

            {/* Right Image - Properly Sized & Spaced */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                <div className="relative">
                     {/* Backdrop circle for image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-transparent rounded-full blur-2xl transform scale-90"></div>
                    <img 
                    src="/icons/course_banner.png"
                    //   src={courseHeroImg} 
                      alt="Study Materials" 
                      className="relative z-10 drop-shadow-xl object-contain h-[300px] md:h-[450px] w-auto hover:scale-105 transition duration-700 ease-out"
                    />
                </div>
            </div>
         </div>
      </div>

      {/* COURSES LIST SECTION */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
         <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">All Tracks</h2>
            <div className="h-[2px] flex-1 bg-gray-100 rounded-full"></div>
         </div>

         {loading ? (
             <div className="text-center py-20 text-xl font-bold text-gray-400">Loading Courses... 🚀</div>
         ) : (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div 
                            key={course.id} 
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-pink-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                        >
                            {/* Course Image Area */}
                            <div className="h-48 overflow-hidden relative bg-gray-50/50 flex items-center justify-center p-8 group-hover:bg-pink-50/30 transition duration-500">
                                <img 
                                    src={course.image_url} 
                                    alt={course.title} 
                                    className="w-auto h-full object-contain transform group-hover:scale-110 transition duration-500 drop-shadow-sm" 
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {course.description}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase group-hover:text-gray-600 transition">
                                        <Layers size={14} />
                                        <span>Start Learning</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center col-span-3 text-red-500 font-bold">
                        No Courses Found.
                    </div>
                )}
             </div>
         )}
      </div>
    </div>
  );
};

export default Courses;