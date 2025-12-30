import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Video, FileText, Users, Compass, CreditCard, CheckCircle, Loader2, X, Lock } from 'lucide-react';

const Premium = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); 
  const [purchasedServices, setPurchasedServices] = useState(new Set()); 

  const services = [
    { id: 1, title: '1:1 Mentorship', icon: <Users size={32} />, desc: 'Personal guidance from FAANG engineers.', price: 49 },
    { id: 2, title: 'Mock Interview', icon: <Video size={32} />, desc: 'Real-time practice with feedback.', price: 49 },
    { id: 3, title: 'Career Guidance', icon: <Compass size={32} />, desc: 'Roadmap planning & doubt solving.', price: 49 },
    { id: 4, title: 'Resume Builder', icon: <FileText size={32} />, desc: 'ATS-friendly resume templates.', price: 49 },
  ];

  const initiatePayment = (service) => {
    if (!user) {
        alert("Please Login first to purchase services! 🔒");
        navigate('/login');
        return;
    }
    if (purchasedServices.has(service.id)) return;
    setSelectedService(service);
    setPaymentStatus('idle');
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
        setPaymentStatus('success');
        setPurchasedServices(prev => new Set(prev).add(selectedService.id));
        setTimeout(() => {
            setShowPaymentModal(false);
            setPaymentStatus('idle');
            setSelectedService(null);
        }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* PAYMENT MODAL */}
      {showPaymentModal && selectedService && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {paymentStatus === 'idle' && (
                    <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
                        <X size={24} />
                    </button>
                )}
                {paymentStatus === 'idle' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Unlock Premium</h3>
                        <p className="text-gray-500 mb-6">Complete your purchase securely.</p>
                        <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-6 border border-gray-100">
                            <div className="text-left">
                                <p className="font-bold text-gray-900">{selectedService.title}</p>
                            </div>
                            <span className="text-xl font-black text-gray-900">₹{selectedService.price}</span>
                        </div>
                        <button onClick={processPayment} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition shadow-lg shadow-gray-900/20 active:scale-95">
                            Pay ₹{selectedService.price}
                        </button>
                    </div>
                )}
                {paymentStatus === 'processing' && (
                    <div className="text-center py-8">
                        <Loader2 size={48} className="animate-spin text-pink-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Processing...</h3>
                    </div>
                )}
                {paymentStatus === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4">Accelerate Your Career 🚀</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get exclusive access to tools and mentorship that will skyrocket your engineering journey.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service) => (
                <div key={service.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:border-pink-200 transition duration-300 flex flex-col items-start group">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:text-white transition">
                        {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">{service.desc}</p>
                    
                    <div className="w-full mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className="text-3xl font-black text-gray-900">₹{service.price}</span>
                        {purchasedServices.has(service.id) ? (
                            <button disabled className="px-6 py-3 bg-green-100 text-green-700 font-bold rounded-xl flex items-center gap-2 cursor-default">
                                <CheckCircle size={18} /> Purchased
                            </button>
                        ) : (
                            <button 
                                onClick={() => initiatePayment(service)}
                                className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition shadow-lg shadow-pink-600/30 flex items-center gap-2"
                            >
                                Get Access
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;