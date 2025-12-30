import React, { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-6 py-5 md:px-12 max-w-7xl mx-auto relative z-50 bg-white">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-gray-900 p-2 rounded-lg">
           <GraduationCap className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">e-learning</span>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
        
        {/* 🔥 NEW LINK ADDED HERE (Before Home) */}
        <Link to="/premium" className="hover:text-gray-900 transition">Accelerate Your Career 🚀</Link>
        
        <Link to="/" className="hover:text-gray-900 transition">Home</Link>
        <Link to="/about" className="hover:text-gray-900 transition">About us</Link>
        <Link to="/courses" className="hover:text-gray-900 transition">Courses</Link>
        <Link to="/dashboard" className="text-pink-600 hover:text-pink-700 transition font-bold">Dashboard</Link>
        <Link to="/contact" className="hover:text-gray-900 transition">Contact us</Link>
      </ul>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 flex flex-col gap-4 md:hidden border-t z-50">
            {/* Mobile Link Added */}
            <Link to="/premium" onClick={() => setIsOpen(false)} className="text-sm font-medium">Accelerate Your Career 🚀</Link>
            
            <Link to="/" onClick={() => setIsOpen(false)} className="text-sm font-medium">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-sm font-medium">About us</Link>
            <Link to="/courses" onClick={() => setIsOpen(false)} className="text-sm font-medium">Courses</Link>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-bold text-pink-600">Dashboard</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-sm font-medium">Contact us</Link>
            <hr />
            <button onClick={() => {navigate('/login'); setIsOpen(false)}} className="text-left text-sm font-medium text-gray-900">Login</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;