import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Match = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        // Note: Make sure your API expects withCredentials, or add the Bearer token here if needed
        const res = await axios.get('http://localhost:5000/api/match/', {
          withCredentials: true
        });
        setMatches(res.data.matches || []);
      } catch (err) {
        setError('Failed to load your matches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // Helper function to generate a placeholder avatar based on the user's name
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Matches</h2>
            <p className="mt-2 text-sm text-gray-500">
              People who have the skills you want, and want the skills you have.
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center mb-8">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          /* Content State */
          <>
            {matches.length === 0 && !error ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No matches yet</h3>
                <p className="mt-1 text-gray-500">Update your profile to find more people to connect with.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map(match => (
                  <div key={match.userId} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col">
                    
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {getInitials(match.name)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate">{match.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{match.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {match.matchScore} Match
                        </span>
                      </div>
                    </div>

                    {/* Card Body (Skills) */}
                    <div className="p-6 flex-1 space-y-5">
                      {/* They can teach */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">They can teach you</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.teachToOther && match.teachToOther.length > 0 ? (
                            match.teachToOther.map((skill, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">None specified</span>
                          )}
                        </div>
                      </div>

                      {/* They want to learn */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">They want to learn</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.learnFromOther && match.learnFromOther.length > 0 ? (
                            match.learnFromOther.map((skill, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">None specified</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <Link 
                        to={`/chat?peer=${match.userId}`} // Assuming you might want to pass peer ID via query param
                        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message {match.name.split(' ')[0]}
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Match;