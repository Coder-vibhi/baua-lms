import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Plus, Save } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // States for Forms
  const [activeTab, setActiveTab] = useState('course'); // course | chapter | video
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Form Data
  const [courseData, setCourseData] = useState({ title: '', description: '', image_url: '', playlist_url: '' });
  const [chapterData, setChapterData] = useState({ course_id: '', title: '', description: '', roadmap_image_url: '' });
  const [videoData, setVideoData] = useState({ chapter_id: '', title: '', video_url: '', sequence_number: 1 });

  // 1. Check if User is Admin
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/user-profile/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.role === 'admin') {
            setIsAdmin(true);
            fetchCourses(); // Load data for dropdowns
          } else {
            navigate('/dashboard'); // Kick out non-admins
          }
          setLoading(false);
        });
    } else {
        navigate('/login');
    }
  }, [user, navigate]);

  const fetchCourses = () => {
    fetch('http://localhost:5000/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  };

  const fetchChapters = (courseId) => {
    fetch(`http://localhost:5000/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setChapters(data.chapters || []));
  };

  // --- SUBMIT HANDLERS ---
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/admin/add-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
    });
    if(res.ok) { alert("Course Added! 🎉"); fetchCourses(); setCourseData({ title: '', description: '', image_url: '', playlist_url: '' }); }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/admin/add-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chapterData)
    });
    if(res.ok) { alert("Chapter Added! 📂"); setChapterData({...chapterData, title: ''}); }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/admin/add-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData)
    });
    if(res.ok) { alert("Video Added! 🎬"); setVideoData({...videoData, title: ''}); }
  };

  if (loading) return <div className="p-10">Checking Admin Privileges...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
                <ShieldAlert size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-gray-900">Admin Panel</h1>
                <p className="text-gray-500">Manage your LMS content securely.</p>
            </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
            {['course', 'chapter', 'video'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 font-bold capitalize transition-all border-b-2 
                        ${activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Add {tab}
                </button>
            ))}
        </div>

        {/* --- FORM 1: ADD COURSE --- */}
        {activeTab === 'course' && (
            <form onSubmit={handleAddCourse} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold mb-4">Create New Course</h2>
                <input type="text" placeholder="Course Title (e.g., ReactJS)" className="w-full p-3 border rounded-lg" required 
                    value={courseData.title} onChange={e => setCourseData({...courseData, title: e.target.value})} />
                <textarea placeholder="Description" className="w-full p-3 border rounded-lg" required
                    value={courseData.description} onChange={e => setCourseData({...courseData, description: e.target.value})} />
                <input type="text" placeholder="Image URL" className="w-full p-3 border rounded-lg" required 
                    value={courseData.image_url} onChange={e => setCourseData({...courseData, image_url: e.target.value})} />
                <input type="text" placeholder="Playlist URL (Optional)" className="w-full p-3 border rounded-lg" 
                    value={courseData.playlist_url} onChange={e => setCourseData({...courseData, playlist_url: e.target.value})} />
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">Create Course</button>
            </form>
        )}

        {/* --- FORM 2: ADD CHAPTER --- */}
        {activeTab === 'chapter' && (
            <form onSubmit={handleAddChapter} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold mb-4">Add Chapter to Course</h2>
                <select className="w-full p-3 border rounded-lg" required onChange={e => setChapterData({...chapterData, course_id: e.target.value})}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input type="text" placeholder="Chapter Title (e.g., Beginner / Two Pointers)" className="w-full p-3 border rounded-lg" required 
                    value={chapterData.title} onChange={e => setChapterData({...chapterData, title: e.target.value})} />
                <input type="text" placeholder="Description (Optional)" className="w-full p-3 border rounded-lg" 
                    value={chapterData.description} onChange={e => setChapterData({...chapterData, description: e.target.value})} />
                <input type="text" placeholder="Roadmap Image URL (For Non-Video Courses)" className="w-full p-3 border rounded-lg" 
                    value={chapterData.roadmap_image_url} onChange={e => setChapterData({...chapterData, roadmap_image_url: e.target.value})} />
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">Add Chapter</button>
            </form>
        )}

        {/* --- FORM 3: ADD VIDEO --- */}
        {activeTab === 'video' && (
            <form onSubmit={handleAddVideo} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-xl font-bold mb-4">Add Video to Chapter</h2>
                <div className="grid grid-cols-2 gap-4">
                    <select className="p-3 border rounded-lg" required onChange={e => {
                        const cid = e.target.value;
                        fetchChapters(cid); // Load chapters when course selected
                    }}>
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <select className="p-3 border rounded-lg" required onChange={e => setVideoData({...videoData, chapter_id: e.target.value})}>
                        <option value="">Select Chapter</option>
                        {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                </div>
                <input type="text" placeholder="Video Title" className="w-full p-3 border rounded-lg" required 
                    value={videoData.title} onChange={e => setVideoData({...videoData, title: e.target.value})} />
                <input type="text" placeholder="YouTube Embed Link" className="w-full p-3 border rounded-lg" required 
                    value={videoData.video_url} onChange={e => setVideoData({...videoData, video_url: e.target.value})} />
                <input type="number" placeholder="Sequence Number" className="w-full p-3 border rounded-lg" required 
                    value={videoData.sequence_number} onChange={e => setVideoData({...videoData, sequence_number: e.target.value})} />
                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">Add Video</button>
            </form>
        )}

      </div>
    </div>
  );
};

export default Admin;