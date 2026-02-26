import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
    <div className="font-bold text-lg">L² Platform</div>
    <div className="space-x-4">
      <Link to="/profile" className="hover:underline">Profile</Link>
      <Link to="/skills" className="hover:underline">Skills</Link>
      <Link to="/match" className="hover:underline">Match</Link>
      <Link to="/chat" className="hover:underline">Chat</Link>
      <Link to="/video" className="hover:underline">Video</Link>
      <Link to="/requests" className="hover:underline">Requests</Link>
      <Link to="/" className="hover:underline">Logout</Link>
    </div>
  </nav>
);

export default Navbar;
