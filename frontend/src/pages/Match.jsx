import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('/api/match/', {
          withCredentials: true
        });
        setMatches(res.data.matches);
      } catch (err) {
        setError('Failed to load matches');
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Match</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div>No matches found.</div>
        ) : (
          matches.map(match => (
            <div key={match.userId} className="bg-white p-4 rounded shadow">
              <div><b>Name:</b> {match.name}</div>
              <div><b>Email:</b> {match.email}</div>
              <div><b>Match Score:</b> {match.matchScore}</div>
              <div><b>Learn From Other:</b> {match.learnFromOther.join(', ')}</div>
              <div><b>Teach To Other:</b> {match.teachToOther.join(', ')}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Match;
