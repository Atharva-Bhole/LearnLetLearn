import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Skills = () => {
  const [skillsKnown, setSkillsKnown] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Separate loading states for better UX
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsFetching(true);
        const res = await axios.get('http://localhost:5000/api/skills/', {
          withCredentials: true
        });
        // Safely handle potentially null/undefined arrays from the backend
        setSkillsKnown(res.data?.skillsKnown?.join(', ') || '');
        setSkillsToLearn(res.data?.skillsToLearn?.join(', ') || '');
      } catch (err) {
        setError('Failed to load your skills. Please refresh the page.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      await axios.put('http://localhost:5000/api/skills/', {
        // .filter(Boolean) prevents empty strings from being saved if there are trailing commas
        skillsKnown: skillsKnown.split(',').map(s => s.trim()).filter(Boolean),
        skillsToLearn: skillsToLearn.split(',').map(s => s.trim()).filter(Boolean)
      }, {
        withCredentials: true
      });
      
      setSuccess('Your skills have been updated successfully!');
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError('Failed to update skills. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Skills</h2>
          <p className="mt-2 text-sm text-gray-500">
            Update the skills you have to offer and the ones you want to learn to improve your matches.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center mb-6 shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-200 flex items-center mb-6 shadow-sm transition-all duration-500">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {isFetching ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Skills Known */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center" htmlFor="skillsKnown">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Skills I Can Teach
                </label>
                <textarea
                  id="skillsKnown"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="e.g., React, Node.js, Graphic Design, Public Speaking"
                  value={skillsKnown}
                  onChange={e => setSkillsKnown(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">Please separate multiple skills with commas.</p>
              </div>

              <hr className="border-gray-100" />

              {/* Skills to Learn */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center" htmlFor="skillsToLearn">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Skills I Want to Learn
                </label>
                <textarea
                  id="skillsToLearn"
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="e.g., Machine Learning, Spanish, SEO, Cooking"
                  value={skillsToLearn}
                  onChange={e => setSkillsToLearn(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">Please separate multiple skills with commas.</p>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`w-full sm:w-auto sm:px-10 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex justify-center items-center shadow-md ${
                    isSaving 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Updates...
                    </>
                  ) : (
                    'Save Skills'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Skills;