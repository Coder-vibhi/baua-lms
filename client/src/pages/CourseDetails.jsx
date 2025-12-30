import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Youtube, Map, X, Coins, ZoomIn, ZoomOut, MessageCircle, BookOpen } from 'lucide-react';
import io from 'socket.io-client';
import CourseChat from '../components/CourseChat'; // 🔥 New Import

// 🔥 Socket Connect (Live Server)
const socket = io.connect("https://baua-lms.onrender.com");

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 New State: Tabs ('curriculum' or 'community')
  const [activeTab, setActiveTab] = useState('curriculum');

  // Roadmap & Zoom State
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [showCoinToast, setShowCoinToast] = useState(false);

  useEffect(() => {
    fetch(`https://baua-lms.onrender.com/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  // Zoom Functions
  const handleZoomIn = (e) => { e.stopPropagation(); setZoomScale(prev => Math.min(prev + 0.2, 3)); };
  const handleZoomOut = (e) => { e.stopPropagation(); setZoomScale(prev => Math.max(prev - 0.2, 0.5)); };
  const handleResetZoom = (e) => { e.stopPropagation(); setZoomScale(1); };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading... 🚀</div>;

  const handleChapterClick = async (chapter) => {
    // CASE 1: DSA (Video Course)
    if (course.id === 1) {
        navigate(`/pattern/${chapter.id}`);
    } 
    // CASE 2: Other Courses (Roadmaps)
    else {
        if(chapter.roadmap_image_url) {
            setSelectedRoadmap(chapter.roadmap_image_url);
            setZoomScale(1);
            
            // Coin Logic
            if (user) {
                try {
                    const res = await fetch('https://baua-lms.onrender.com/mark-roadmap-viewed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id, chapterId: chapter.id })
                    });
                    const data = await res.json();
                    if (data.coinsAdded > 0) {
                        setShowCoinToast(true);
                        setTimeout(() => setShowCoinToast(false), 3000);
                    }
                } catch (err) { console.error("Coin error:", err); }
            }
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <Navbar />

      {/* COIN TOAST */}
      {showCoinToast && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 border-2 border-white">
                <Coins size={24} /> <span>+1 Coin Earned!</span>
            </div>
        </div>
      )}

      {/* ZOOMABLE ROADMAP MODAL */}
      {selectedRoadmap && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4" onClick={() => setSelectedRoadmap(null)}>
            <div className="absolute top-6 flex gap-4 z-50 bg-gray-800 p-2 rounded-full border border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleZoomOut} className="p-2 text-white hover:bg-gray-700 rounded-full"><ZoomOut size={24} /></button>
                <button onClick={handleResetZoom} className="p-2 text-white hover:bg-gray-700 rounded-full font-bold text-sm px-2">{Math.round(zoomScale * 100)}%</button>
                <button onClick={handleZoomIn} className="p-2 text-white hover:bg-gray-700 rounded-full"><ZoomIn size={24} /></button>
                <div className="w-[1px] h-6 bg-gray-600 mx-2 self-center"></div>
                <button onClick={() => setSelectedRoadmap(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><X size={24} /></button>
            </div>
            <div className="w-full h-full overflow-auto flex items-center justify-center cursor-grab active:cursor-grabbing custom-scrollbar mt-16" onClick={(e) => e.stopPropagation()}>
                <img src={selectedRoadmap} alt="Roadmap" className="max-w-none transition-transform duration-200 ease-out rounded-lg shadow-2xl" style={{ transform: `scale(${zoomScale})` }} />
            </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-gray-900 text-white py-12 px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {course.id === 1 ? "Video Course" : "Roadmap Course"}
                </span>
                <h1 className="text-4xl md:text-6xl font-black mt-4 mb-2">{course.title}</h1>
                <p className="text-gray-400 text-lg max-w-2xl">{course.description}</p>
            </div>
            {course.playlist_url && (
                <a href={course.playlist_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition transform hover:scale-105 shadow-lg shadow-red-600/30">
                    <Youtube size={24} /> Watch Playlist
                </a>
            )}
        </div>
      </div>

      {/* 🔥 MAIN CONTENT AREA WITH TABS */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 pb-12">
        
        {/* TABS BUTTONS */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('curriculum')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 ${
                    activeTab === 'curriculum' 
                    ? 'bg-white text-gray-900 border-2 border-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white border-2 border-gray-700'
                }`}
            >
                <BookOpen size={20} /> Curriculum
            </button>
            <button 
                onClick={() => setActiveTab('community')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 ${
                    activeTab === 'community' 
                    ? 'bg-white text-pink-600 border-2 border-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white border-2 border-gray-700'
                }`}
            >
                <MessageCircle size={20} /> Community
            </button>
        </div>

        {/* TAB CONTENT: CURRICULUM (Existing Grid) */}
        {activeTab === 'curriculum' && (
            <div className="animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-2 border-l-4 border-pink-500">
                    {course.id === 1 ? "Study Patterns" : "Learning Roadmap"}
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {course.chapters && course.chapters.length > 0 ? (
                        course.chapters
                        .filter(c => course.id === 1 || c.roadmap_image_url)
                        .map((chapter, index) => (
                            <div 
                                key={chapter.id}
                                onClick={() => handleChapterClick(chapter)}
                                className={`bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-pink-500 transition cursor-pointer group flex flex-col items-center text-center
                                    ${course.id !== 1 ? 'py-12' : ''} 
                                `}
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold group-hover:bg-gray-900 group-hover:text-white transition mb-4">
                                    {course.id === 1 ? (
                                        <span className="text-xl">{index + 1}</span>
                                    ) : (
                                        <Map size={32} />
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition">
                                    {chapter.title}
                                </h3>
                                
                                {course.id === 1 && (
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {chapter.description || "Master this pattern."}
                                    </p>
                                )}

                                {course.id !== 1 && (
                                    <span className="mt-4 text-xs font-bold text-pink-500 uppercase tracking-widest border border-pink-100 px-3 py-1 rounded-full">
                                        Tap to View (+1 Coin)
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">No content added yet.</div>
                    )}
                </div>
            </div>
        )}

        {/* TAB CONTENT: COMMUNITY (Chat) */}
        {activeTab === 'community' && (
            <div className="animate-in fade-in duration-500">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px]">
                    <div className="p-6 bg-pink-50 border-b border-pink-100">
                        <h2 className="text-xl font-bold text-gray-900">Discuss {course.title}</h2>
                        <p className="text-sm text-gray-500">Ask doubts, share logic, and help others!</p>
                    </div>
                    {/* 🔥 Chat Component Loaded Here */}
                    <div className="h-[500px] p-4">
                        <CourseChat socket={socket} roomId={`course_${course.id}`} />
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default CourseDetails;