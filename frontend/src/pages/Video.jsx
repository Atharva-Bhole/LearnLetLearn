import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('/', { autoConnect: false });

const Video = () => {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          withCredentials: true
        });
        setUserId(res.data._id);
        socket.connect();
      } catch (err) {
        setStatus('Failed to load profile');
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
    });
    socket.on('video_answer', async ({ answer }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
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
    socket.emit('join_video_room', { roomId, userId });
    setStatus('Joined room');
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(mediaStream);
    localVideo.current.srcObject = mediaStream;
    const pc = new RTCPeerConnection();
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
  };

  const startCall = async () => {
    if (!peerConnection) return;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('video_offer', { roomId, offer, senderId: userId });
    setStatus('Call started');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Video Call</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Room ID"
          className="p-2 border rounded mr-2"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={joinRoom}>Join Room</button>
        <button className="bg-green-600 text-white px-4 py-1 rounded ml-2" onClick={startCall}>Start Call</button>
      </div>
      <div className="flex space-x-4">
        <video ref={localVideo} autoPlay muted className="w-64 h-48 bg-black" />
        <video ref={remoteVideo} autoPlay className="w-64 h-48 bg-black" />
      </div>
      {status && <div className="mt-4 text-blue-600">{status}</div>}
    </div>
  );
};

export default Video;
