import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- EXISTING IMPORTS ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import PatternViewer from './pages/PatternViewer';
import Dashboard from './pages/Dashboard';
import Premium from './pages/Premium';
import Admin from './pages/Admin';

// 🔥 NEW IMPORT (AI Chatbot)
import AIChatbot from './components/AIChatbot'; 

function App() {
  return (
    <div className="relative min-h-screen"> 
      {/* NOTE: Humne 'relative' div lagaya hai taaki 
         chatbot screen ke upar sahi se float kare.
      */}

      <Routes>
        {/* Home & Static Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Course & Learning Pages */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/pattern/:chapterId" element={<PatternViewer />} />
        
        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Panel (Secret Route) */}
        <Route path="/admin" element={<Admin />} /> 
      </Routes>

      {/* 🔥 AI CHATBOT INTEGRATED HERE */}
      {/* Ye routes ke bahar hai, isliye ye har page par dikhega, 
          lekin iske andar logic hai ki ye sirf Logged In user ko dikhe */}
      <AIChatbot />

    </div>
  );
}

export default App;