import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await axios.get('http://localhost:5000/api/admin/reviews');
      setReviews(res.data);
    };
    fetchReviews();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    await axios.patch(`http://localhost:5000/api/admin/reviews/${id}`, { status: newStatus });
    window.location.reload();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-black uppercase italic mb-8">User Reviews</h2>
      <div className="grid gap-4">
        {reviews.map(r => (
          <div key={r._id} className="p-6 bg-white border rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-bold">{r.userName} - {r.rating}★</p>
              <p className="text-gray-500">{r.comment}</p>
            </div>
            <button onClick={() => toggleStatus(r._id, r.status)} 
              className={`px-6 py-2 rounded-full font-black text-[10px] uppercase ${r.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
              {r.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminReviews;