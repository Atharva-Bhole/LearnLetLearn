import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('/', { autoConnect: false });

const Chat = () => {
  const [peerId, setPeerId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          withCredentials: true
        });
        setUserId(res.data._id);
        socket.connect();
        socket.emit('join', { userId: res.data._id });
      } catch (err) {
        setError('Failed to load profile');
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
    socket.emit('fetch_history', { userId, peerId }, history => {
      setMessages(history);
    });
  };

  const sendMessage = () => {
    socket.emit('send_message', { senderId: userId, receiverId: peerId, message });
    setMessages(prev => [...prev, { senderId: userId, message, timestamp: new Date() }]);
    setMessage('');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Peer User ID"
          className="p-2 border rounded mr-2"
          value={peerId}
          onChange={e => setPeerId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={fetchHistory}>Fetch History</button>
      </div>
      <div className="bg-white p-4 rounded shadow mb-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.senderId === userId ? 'text-right' : 'text-left'}>
            <span className="font-bold">{msg.senderId === userId ? 'Me' : 'Peer'}:</span> {msg.message}
            <span className="text-xs text-gray-500 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full p-2 border rounded mr-2"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
