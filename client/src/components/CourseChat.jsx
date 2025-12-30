import React, { useEffect, useState, useRef } from 'react';
import { Send, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Apne path ke hisab se adjust karein

const CourseChat = ({ socket, roomId }) => {
  const { user } = useAuth();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  // Room Join karo jab component load ho
  useEffect(() => {
    if(roomId && socket) {
        socket.emit("join_room", roomId);
    }
  }, [roomId, socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: roomId,
        author: user ? user.name : "Guest",
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessage = (data) => {
        setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", receiveMessage);
    return () => socket.off("receive_message", receiveMessage);
  }, [socket]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="flex flex-col h-[500px] bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Chat Header */}
        <div className="p-3 bg-gray-100 border-b border-gray-200 font-bold text-gray-700 text-sm">
            Live Discussion 🔴
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messageList.length === 0 && (
                <p className="text-center text-xs text-gray-400 mt-10">Start the conversation! 👋</p>
            )}
            {messageList.map((msg, index) => {
                const isMe = msg.author === (user ? user.name : "Guest");
                return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-2 rounded-lg text-xs ${
                            isMe ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-800"
                        }`}>
                            <p className="font-bold text-[10px] mb-0.5 opacity-70">{msg.author}</p>
                            <p>{msg.message}</p>
                            <p className="text-[8px] text-right mt-0.5 opacity-60">{msg.time}</p>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-2 border-t border-gray-200 flex gap-2 bg-white rounded-b-xl">
            <input
                type="text"
                value={currentMessage}
                placeholder="Ask doubt..."
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500"
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700">
                <Send size={16} />
            </button>
        </div>
    </div>
  );
};

export default CourseChat;