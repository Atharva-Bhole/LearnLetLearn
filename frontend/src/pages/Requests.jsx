import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/api/request/received', {
          withCredentials: true
        });
        setRequests(res.data.requests);
      } catch (err) {
        setError('Failed to load requests');
      }
    };
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, action) => {
    try {
      await axios.post('/api/request/respond', { requestId, action }, {
        withCredentials: true
      });
      setSuccess(`Request ${action}ed`);
      setError('');
      setRequests(requests.filter(r => r._id !== requestId));
    } catch (err) {
      setError('Failed to respond');
      setSuccess('');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Requests</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div>No requests found.</div>
        ) : (
          requests.map(request => (
            <div key={request._id} className="bg-white p-4 rounded shadow">
              <div><b>From:</b> {request.sender.name} ({request.sender.email})</div>
              <button className="bg-green-600 text-white px-4 py-1 rounded mr-2" onClick={() => handleRespond(request._id, 'accept')}>Accept</button>
              <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleRespond(request._id, 'reject')}>Reject</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Requests;
