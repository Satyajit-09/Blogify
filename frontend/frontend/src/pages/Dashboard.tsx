// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:8787/api/v1/book/1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts([res.data]); // Adjust depending on how your GET endpoint works
    } catch (err) {
      console.error(err);
      navigate('/signin');
    }
  };

  const handleCreatePost = async () => {
    try {
      await axios.post(
        'http://localhost:8787/api/v1/book',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📚 Blog Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <input
            className="w-full p-2 border rounded mb-4"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded mb-4"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            onClick={handleCreatePost}
          >
            Publish
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

