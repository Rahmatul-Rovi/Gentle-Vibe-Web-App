import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reviews/approved').then(res => setReviews(res.data));
  }, []);

  return (
    <div className="py-20 px-10">
      <h2 className="text-6xl font-black uppercase italic text-center mb-16">Community Vibes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map(r => (
          <div key={r._id} className="p-8 bg-gray-50 rounded-[2rem] relative">
            <Quote className="absolute top-6 right-6 text-gray-200" size={40} />
            <div className="flex gap-1 mb-4">
              {[...Array(r.rating)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="font-bold text-lg mb-6 italic">"{r.comment}"</p>
            <div className="flex items-center gap-4">
              <img src={r.userPhoto || "https://via.placeholder.com/50"} className="w-12 h-12 rounded-full object-cover" />
              <p className="font-black uppercase text-xs tracking-widest">{r.userName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Testimonials;