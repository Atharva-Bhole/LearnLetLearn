import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skillsKnown: '',
    skillsToLearn: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', {
        ...form,
        skillsKnown: form.skillsKnown.split(',').map(s => s.trim()),
        skillsToLearn: form.skillsToLearn.split(',').map(s => s.trim())
      }, {
        withCredentials: true
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="skillsKnown"
          type="text"
          placeholder="Skills Known (comma separated)"
          className="w-full mb-2 p-2 border rounded"
          value={form.skillsKnown}
          onChange={handleChange}
        />
        <input
          name="skillsToLearn"
          type="text"
          placeholder="Skills To Learn (comma separated)"
          className="w-full mb-2 p-2 border rounded"
          value={form.skillsToLearn}
          onChange={handleChange}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">Register</button>
        <div className="mt-2 text-center">
          <span>Already have an account? </span>
          <a href="/" className="text-blue-600 underline">Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
