import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('/', { autoConnect: false });

const Video = () => {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  
  // UI States for better UX
  const [isJoined, setIsJoined] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

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
      } catch (err) {
        setStatus('Failed to load profile. Please log in again.');
      }
    };
    fetchProfile();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!peerConnection) return;
    
    socket.on('video_offer', async ({ offer, senderId }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('video_answer', { roomId, answer, senderId: userId });
      setStatus('Call connected');
      setIsCalling(true);
    });
    
    socket.on('video_answer', async ({ answer }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      setStatus('Call connected');
      setIsCalling(true);
    });
    
    socket.on('ice_candidate', async ({ candidate }) => {
      if (candidate) peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
    
    return () => {
      socket.off('video_offer');
      socket.off('video_answer');
      socket.off('ice_candidate');
    };
  }, [peerConnection, roomId, userId]);

  const joinRoom = async () => {
    if (!roomId.trim()) return;
    
    try {
      setStatus('Accessing camera and microphone...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      localVideo.current.srcObject = mediaStream;
      
      socket.emit('join_video_room', { roomId, userId });
      setIsJoined(true);
      setStatus('Joined room. Ready to call.');
      
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Added public STUN server for better connectivity
      });
      
      mediaStream.getTracks().forEach(track => pc.addTrack(track, mediaStream));
      
      pc.ontrack = event => {
        remoteVideo.current.srcObject = event.streams[0];
      };
      
      pc.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice_candidate', { roomId, candidate: event.candidate, senderId: userId });
        }
      };
      
      setPeerConnection(pc);
    } catch (err) {
      setStatus('Error accessing camera/microphone. Please check permissions.');
    }
  };

  const startCall = async () => {
    if (!peerConnection) return;
    try {
      setStatus('Calling peer...');
      setIsCalling(true);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('video_offer', { roomId, offer, senderId: userId });
    } catch (err) {
      setStatus('Failed to start the call.');
      setIsCalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
        
        {/* Header Area */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Live Mentorship Session</h2>
          </div>
          
          {/* Status Badge */}
          {status && (
            <div className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors ${
              status.includes('Error') || status.includes('Failed') ? 'bg-red-100 text-red-700' :
              status.includes('connected') || status.includes('Calling') ? 'bg-green-100 text-green-700' :
              'bg-blue-50 text-blue-700 border border-blue-100'
            }`}>
              <span className="flex items-center">
                {status.includes('connected') && <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>}
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Video Stage (Dark Mode) */}
        <div className="bg-gray-900 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Local Video */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-gray-700 group">
            <video 
              ref={localVideo} 
              autoPlay 
              playsInline 
              muted // Always keep local muted to prevent feedback loop
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirrors the camera so it feels natural
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center">
              You
            </div>
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-500">
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-sm font-medium">Camera Off</p>
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-gray-700 flex items-center justify-center">
            <video 
              ref={remoteVideo} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center z-10">
              Peer
            </div>
            {!isCalling && (
              <div className="absolute inset-0 flex items-center justify-center flex-col text-gray-500 bg-gray-800">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-3 animate-pulse">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <p className="text-sm font-medium">Waiting for peer...</p>
              </div>
            )}
          </div>

        </div>

        {/* Controls Bar */}
        <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            
            <input
              type="text"
              placeholder="Enter Room ID"
              disabled={isJoined}
              className="w-full sm:flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 transition-colors shadow-sm"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
            />
            
            <div className="flex w-full sm:w-auto gap-3">
              {!isJoined ? (
                <button 
                  onClick={joinRoom}
                  disabled={!roomId.trim()}
                  className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Join Room
                </button>
              ) : (
                <button 
                  onClick={startCall}
                  disabled={isCalling}
                  className={`w-full sm:w-auto text-white font-medium px-6 py-3 rounded-xl transition shadow-md whitespace-nowrap flex items-center justify-center ${
                    isCalling 
                      ? 'bg-green-500/50 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 00.95.684H19a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                  </svg>
                  Start Call
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;