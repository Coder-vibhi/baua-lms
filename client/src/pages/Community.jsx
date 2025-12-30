import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, User } from 'lucide-react';

// Server se connect karo (Production me Render ki URL dalna)
const socket = io.connect("http://localhost:5000");

const Community = () => {
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: "dsa_community",
        author: user ? user.name : "Guest",
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]); // Khud ka msg list me add karo
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    // Dusro ke message suno
    const receiveMessage = (data) => {
        setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessage);

    // Cleanup (Double messages rokne ke liye)
    return () => {
        socket.off("receive_message", receiveMessage);
    };
  }, [socket]);

  // Auto Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-[80vh] flex flex-col">
        
        {/* HEADER */}
        <div className="bg-pink-600 p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
                👥 DSA Community Hub
            </h2>
            <span className="text-xs bg-pink-700 px-2 py-1 rounded-full">Live Chat</span>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
            {messageList.map((msg, index) => {
                const isMe = msg.author === (user ? user.name : "Guest");
                return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${
                            isMe ? "bg-gray-900 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
                        }`}>
                            <p className="font-bold text-[10px] mb-1 opacity-70 flex items-center gap-1">
                                {!isMe && <User size={10} />} {msg.author}
                            </p>
                            <p>{msg.message}</p>
                            <p className="text-[10px] text-right mt-1 opacity-60">{msg.time}</p>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
            <input
                type="text"
                value={currentMessage}
                placeholder="Ask a doubt or help others..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-pink-500 bg-gray-50"
                onChange={(event) => setCurrentMessage(event.target.value)}
                onKeyPress={(event) => event.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition shadow-md">
                <Send size={20} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default Community;