import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);

    const fetchApartment = async () => {
      try {
        const res = await API.get(`/apartments/${id}`);
        setApartment(res.data);
      } catch (err) {
        console.error("Failed to load apartment:", err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/${id}`);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    fetchApartment();
    fetchReviews();
    setLoading(false);

    const interval = setInterval(() => {
      fetchReviews();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const renderStars = (count) => {
    const total = 5;
    const filled = Math.round(count);

    return Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-sm ${
          i < filled ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        star
      </span>
    ));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!apartment) return <div className="p-6">Apartment not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <img
        src={apartment.image}
        alt={apartment.title}
        className="w-full h-[400px] object-cover rounded-md mb-6 border-2 border-primary"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">{apartment.title}</h1>
        <p className="text-gray-600">{apartment.address}</p>

        <div className="mt-2 flex items-center gap-1 text-gray-700">
          <span className="material-symbols-outlined text-yellow-500">
            star
          </span>
          <strong>{apartment.rating ?? "No rating"}</strong>
          <span className="text-sm ml-1">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-1">Description</h2>
        <p className="text-gray-700">{apartment.description}</p>
      </div>

      {user?.role === "tenant" && (
        <button
          className="btn btn-primary mb-6"
          onClick={() => navigate(`/reviews/create/${id}`)}
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Add a review
        </button>
      )}

      <div>
        <h2 className="text-lg font-bold mb-3">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="flex items-start gap-4 mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-500">
                account_circle
              </span>
              <div>
                <p className="font-semibold">
                  {review.user.name}
                  <span className="ml-2 flex items-center gap-1">
                    {renderStars(review.rating)}
                  </span>
                </p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApartmentDetails;
