import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/post');
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Posts Feed</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {posts.length === 0 && !loading && <div>No posts yet.</div>}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold text-lg">{post.title}</div>
            <div className="text-gray-700 mb-2">{post.content}</div>
            <div className="text-xs text-gray-500">By {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
