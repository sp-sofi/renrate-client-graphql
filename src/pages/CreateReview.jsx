import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

const CreateReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews/${id}`, { rating, comment });
      navigate(`/apartments/${id}`);
    } catch (err) {
      console.error("Submit review error:", err);
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold mb-6">Write a Review</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`material-symbols-outlined text-3xl cursor-pointer transition ${
                  star <= (hover || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                star
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this property"
            rows={5}
            className="textarea textarea-bordered w-full"
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="btn btn-outline btn-primary"
            onClick={() => navigate(`/apartments/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
