import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext'; // User ID chahiye
import { Play, ChevronLeft, CheckCircle, Coins } from 'lucide-react'; // Icons

const PatternViewer = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Logged in user
  
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set()); // Track completed locally
  const [coinsAnim, setCoinsAnim] = useState(false); // Animation toggle

  useEffect(() => {
    // Videos fetch logic... (Same as before)
    fetch(`https://baua-lms.onrender.com/chapters/${chapterId}/videos`)
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        if (data.length > 0) setCurrentVideo(data[0]);
      });
      
    // TODO: Fetch already completed videos status here later
  }, [chapterId]);

  const markAsComplete = async () => {
    if (!user) return alert("Please Login to earn coins!");
    
    // API Call
    const res = await fetch('https://baua-lms.onrender.com/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, videoId: currentVideo.id, chapterId })
    });
    
    const data = await res.json();
    
    if (data.coinsAdded > 0) {
        // Animation Trigger
        setCoinsAnim(true);
        setTimeout(() => setCoinsAnim(false), 2000);
        
        // Local state update (Green tick dikhane ke liye)
        setCompletedVideos(prev => new Set(prev).add(currentVideo.id));
    } else {
        alert("You already collected coins for this video!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />

      {/* COIN ANIMATION OVERLAY */}
      {coinsAnim && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="animate-bounce bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-2xl shadow-xl flex items-center gap-2">
                <Coins size={32} /> +1 Coin Earned!
            </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: MAIN VIDEO PLAYER */}
        <div className="w-full lg:w-3/4">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm font-bold">
                <ChevronLeft size={16}/> Back to Course
            </button>

            {currentVideo ? (
                <div className="space-y-4">
                    <div className="relative w-full pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <iframe 
                            src={`${currentVideo.video_url}?rel=0`}
                            title={currentVideo.title}
                            className="absolute top-0 left-0 w-full h-full"
                            allowFullScreen
                        ></iframe>
                    </div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{currentVideo.title}</h1>
                            <p className="text-gray-400 mt-2 text-sm">Now Playing • Lecture {currentVideo.sequence_number}</p>
                        </div>
                        
                        {/* MARK COMPLETE BUTTON */}
                        <button 
                            onClick={markAsComplete}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition transform active:scale-95
                                ${completedVideos.has(currentVideo.id) 
                                    ? 'bg-green-600 text-white cursor-default' 
                                    : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
                                }`}
                        >
                            {completedVideos.has(currentVideo.id) ? (
                                <><CheckCircle size={20}/> Completed</>
                            ) : (
                                <><Coins size={20}/> Mark Complete (+1)</>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>

        {/* RIGHT: PLAYLIST (Same code as before, just kept minimal here) */}
        <div className="w-full lg:w-1/4 bg-gray-800 rounded-2xl border border-gray-700 p-4">
            <h3 className="font-bold text-lg mb-4">Course Content</h3>
            <div className="space-y-2">
                {videos.map((vid) => (
                    <div 
                        key={vid.id}
                        onClick={() => setCurrentVideo(vid)}
                        className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition
                             ${currentVideo?.id === vid.id ? 'bg-pink-600' : 'hover:bg-gray-700'}`}
                    >
                       <Play size={16} /> 
                       <span className="text-sm font-medium line-clamp-1">{vid.title}</span>
                       {completedVideos.has(vid.id) && <CheckCircle size={14} className="text-green-400 ml-auto"/>}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PatternViewer;