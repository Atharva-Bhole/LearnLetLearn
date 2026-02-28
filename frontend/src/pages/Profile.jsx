import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile data. Please try logging in again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Helper function for avatar initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h2>
          {profile && (
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-800 transition bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center mb-6">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : profile ? (
          
          /* Profile Card */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Cover Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            
            <div className="px-8 pb-8">
              {/* Avatar & Basic Info */}
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="flex items-end space-x-5">
                  <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700 border border-gray-100">
                      {getInitials(profile.name)}
                    </div>
                  </div>
                  <div className="pb-2">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      {profile.name}
                      {profile.role && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                          {profile.role}
                        </span>
                      )}
                    </h1>
                    <p className="text-sm font-medium text-gray-500">{profile.email}</p>
                  </div>
                </div>
                
                {/* Optional: Add an "Edit Profile" button here later */}
                <button className="mb-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition">
                  Edit Profile
                </button>
              </div>

              <hr className="border-gray-100 mb-8" />

              {/* Skills Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Skills Known */}
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100/50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Skills I Know
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsKnown && profile.skillsKnown.length > 0 ? (
                      profile.skillsKnown.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No skills added yet.</p>
                    )}
                  </div>
                </div>

                {/* Skills To Learn */}
                <div className="bg-purple-50/50 rounded-xl p-6 border border-purple-100/50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Skills I Want to Learn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsToLearn && profile.skillsToLearn.length > 0 ? (
                      profile.skillsToLearn.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 shadow-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No skills requested yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;