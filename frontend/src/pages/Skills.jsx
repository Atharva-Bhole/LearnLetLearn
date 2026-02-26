import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Skills = () => {
  const [skillsKnown, setSkillsKnown] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('/api/skills/', {
          withCredentials: true
        });
        setSkillsKnown(res.data.skillsKnown.join(', '));
        setSkillsToLearn(res.data.skillsToLearn.join(', '));
      } catch (err) {
        setError('Failed to load skills');
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('/api/skills/', {
        skillsKnown: skillsKnown.split(',').map(s => s.trim()),
        skillsToLearn: skillsToLearn.split(',').map(s => s.trim())
      }, {
        withCredentials: true
      });
      setSuccess('Skills updated');
      setError('');
    } catch (err) {
      setError('Failed to update skills');
      setSuccess('');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
        <label className="block mb-2">Skills Known (comma separated)</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={skillsKnown}
          onChange={e => setSkillsKnown(e.target.value)}
        />
        <label className="block mb-2">Skills To Learn (comma separated)</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={skillsToLearn}
          onChange={e => setSkillsToLearn(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">Update Skills</button>
      </form>
    </div>
  );
};

export default Skills;
