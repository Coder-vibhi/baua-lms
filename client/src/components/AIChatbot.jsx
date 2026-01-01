import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, Sparkles, Clock, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown'; 

const AIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // 👋 Message thoda aur friendly kar diya
  const [messages, setMessages] = useState([
    { text: "Yo! I'm **Baua AI**. DSA doubt ho ya Debugging, seedha pucho! 🚀", sender: 'bot' }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Trial Logic
  const [daysLeft, setDaysLeft] = useState(7);
  const [isExpired, setIsExpired] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) checkTrialStatus();
  }, [user]);

  const checkTrialStatus = async () => {
    try {
        const res = await fetch(`https://baua-lms.onrender.com/user-profile/${user.id}`);
        const data = await res.json();
        if (!data.ai_trial_start) setDaysLeft(7);
        else {
            const diffDays = Math.ceil(Math.abs(new Date() - new Date(data.ai_trial_start)) / (1000 * 60 * 60 * 24));
            if (diffDays > 7) { setIsExpired(true); setDaysLeft(0); }
            else setDaysLeft(7 - diffDays);
        }
    } catch (e) { console.error("Trial Check Error:", e); }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // --- 🔥 UPDATED AI PROMPT (COOLER VERSION) ---
  const fetchGeminiResponse = async (userQuery) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return "⚠️ System Error: API Key missing.";

    const modelName = "gemini-2.5-flash"; 
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // 👇 NEW "PRO CODER" INSTRUCTIONS
    const payload = {
      contents: [{
        parts: [{
          text: `You are 'Baua AI', a smart, cool, and expert Coding Mentor.
                 
                 YOUR CODING STYLE:
                 1. **LeetCode/Competitive Style:** Write short, clean, and efficient code.
                 2. **No Fluff:** Don't write extensive boilerplate (like 'List[int]') unless necessary. Use simple variable names like 'seen', 'map', 'res', 'curr'.
                 3. **Minimal Comments:** Only comment on the tricky logic. Don't explain obvious lines like "loop through array".
                 
                 YOUR TONE:
                 1. Direct and to the point.
                 2. Use Markdown formatting.
                 3. Explain the logic in max 2 bullet points AFTER the code.

                 Example of what user wants (Two Sum):
                 def twoSum(nums, target):
                     seen = {}
                     for i, num in enumerate(nums):
                         rem = target - num
                         if rem in seen: return [seen[rem], i]
                         seen[num] = i
                 
                 Now answer this Student Question: ${userQuery}`
        }]
      }]
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.error) return `⚠️ AI Error: ${data.error.message}`;
      if (data.candidates && data.candidates[0].content) {
          return data.candidates[0].content.parts[0].text;
      }
      return "Thinking...";

    } catch (error) {
      return "Oops! Internet connection error.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (isExpired) { setShowPaywall(true); return; }

    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    const aiResponse = await fetchGeminiResponse(userMsg);
    setMessages(prev => [...prev, { text: aiResponse, sender: 'bot' }]);
    setIsTyping(false);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="group relative flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full shadow-2xl hover:scale-110 transition animate-bounce-slow border-2 border-pink-500">
            <Bot size={32} />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">AI</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
            <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-600 p-2 rounded-lg"><Sparkles size={18} className="text-white" /></div>
                    <div>
                        <h3 className="font-bold text-sm">Baua AI Mentor</h3>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {isExpired ? "Expired" : `${daysLeft} Days Free Trial`}</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>

            {showPaywall ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                    <div className="bg-red-100 p-4 rounded-full text-red-500 mb-4"><Lock size={40} /></div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Trial Ended</h3>
                    <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400">Close</button>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                                    <ReactMarkdown
                                        components={{
                                            strong: ({node, ...props}) => <span className="font-bold text-pink-600" {...props} />,
                                            code: ({node, inline, className, children, ...props}) => {
                                                return !inline ? (
                                                    <div className="bg-gray-800 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto font-mono text-xs">
                                                        {children}
                                                    </div>
                                                ) : (
                                                    <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded font-mono text-xs" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props} />,
                                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                            h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-base font-bold my-2" {...props} />,
                                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                             <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-pink-600" />
                                    <span className="text-xs text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border border-transparent focus-within:border-pink-500 transition">
                            <input type="text" placeholder="Ask doubt..." className="bg-transparent flex-1 outline-none text-sm text-gray-700" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                            <button onClick={handleSend} disabled={!input.trim() || isTyping} className={`p-2 rounded-full transition ${input.trim() ? 'bg-pink-600 text-white shadow-md' : 'text-gray-400'}`}><Send size={16} /></button>
                        </div>
                    </div>
                </>
            )}
        </div>
      )}
    </div>
  );
};

export default AIChatbot;