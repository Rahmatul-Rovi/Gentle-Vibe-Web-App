import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
        fetchReviews();
      } catch (err) {
        console.error(err);
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-black uppercase italic mb-8">Management: User Reviews</h2>

      <div className="grid gap-3">
        {reviews.map(r => (
          <div
            key={r._id}
            className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-start shadow-sm hover:shadow-md transition-all"
          >
            {/* LEFT SIDE */}
            <div className="flex items-start gap-4">
              <img
                src={r.userPhoto || "https://via.placeholder.com/50"}
                alt={r.userName}
                className="w-12 h-12 rounded-full object-cover border"
              />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black uppercase text-xs tracking-wider">{r.userName}</p>
                  <span className="text-amber-500 text-xs font-bold">{r.rating}★</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {r.comment}
                </p>
              </div>
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(r._id)}
              className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all self-start"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
