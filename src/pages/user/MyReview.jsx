import React, { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import Swal from 'sweetalert2';

const MyReview = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login first to submit a review!',
        confirmButtonColor: '#000'
      });
      return;
    }

    const reviewData = {
      user: user?._id || user?.id || user?.email,
      userName: user?.name || "Guest User",
      userPhoto: user?.photoURL || "",
      rating: Number(rating),
      comment
    };

    try {
      await axios.post('http://localhost:5000/api/reviews', reviewData);

      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: 'Your review has been submitted!❤️',
        confirmButtonColor: '#000'
      });

      setComment("");
      setRating(5);

    } catch (err) {
      console.error(err.response?.data || err.message);

      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Review submit failed. Please try again!',
        confirmButtonColor: '#000'
      });
    }
  };

  return (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <h2 className="text-3xl font-black uppercase italic mb-6">Write a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              size={30}
              fill={num <= rating ? "black" : "none"}
              className="cursor-pointer"
              onClick={() => setRating(num)}
            />
          ))}
        </div>

        <textarea
          className="w-full p-4 border rounded-2xl h-32"
          placeholder="Tell us about your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button className="bg-black text-white px-8 py-3 font-black uppercase italic rounded-xl">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default MyReview;
