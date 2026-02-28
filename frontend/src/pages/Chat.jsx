import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('/', { autoConnect: false });

const Chat = () => {
  const [peerId, setPeerId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  
  // Ref for auto-scrolling to the bottom of the chat
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserId(res.data._id);
        socket.connect();
        socket.emit('join', { userId: res.data._id });
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      }
    };
    fetchProfile();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on('receive_message', msg => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const fetchHistory = () => {
    if (!peerId) return;
    socket.emit('fetch_history', { userId, peerId }, history => {
      setMessages(history);
    });
  };

  const sendMessage = (e) => {
    e?.preventDefault(); // Allow calling from form submit
    if (!message.trim() || !peerId) return;

    socket.emit('send_message', { senderId: userId, receiverId: peerId, message });
    setMessages(prev => [...prev, { senderId: userId, message, timestamp: new Date() }]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh] min-h-[600px] border border-gray-200">
        
        {/* Header Section */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter Peer ID..."
              className="text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 flex-grow sm:w-48 transition"
              value={peerId}
              onChange={e => setPeerId(e.target.value)}
            />
            <button 
              className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded-lg transition shadow-sm whitespace-nowrap"
              onClick={fetchHistory}
            >
              Load Chat
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Enter a Peer ID and start messaging</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === userId;
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed break-words">{msg.message}</p>
                    <div className={`text-[10px] mt-1 flex ${isMe ? 'text-blue-100 justify-end' : 'text-gray-400 justify-start'}`}>
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/* Invisible div to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
          <form 
            className="flex items-end gap-2 max-w-4xl mx-auto" 
            onSubmit={sendMessage}
          >
            <input
              type="text"
              placeholder={peerId ? "Type a message..." : "Enter a Peer ID above first..."}
              disabled={!peerId}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!message.trim() || !peerId}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Chat;