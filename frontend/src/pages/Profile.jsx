import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/profile', {
          withCredentials: true
        });
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {profile ? (
        <div className="bg-white p-6 rounded shadow w-96">
          <div><b>Name:</b> {profile.name}</div>
          <div><b>Email:</b> {profile.email}</div>
          <div><b>Role:</b> {profile.role}</div>
          <div><b>Skills Known:</b> {profile.skillsKnown.join(', ')}</div>
          <div><b>Skills To Learn:</b> {profile.skillsToLearn.join(', ')}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Profile;
