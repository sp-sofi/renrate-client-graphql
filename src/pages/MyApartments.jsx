import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const MyApartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await API.get("/apartments/mine");
        const apartments = res.data;

        const apartmentsWithCounts = await Promise.all(
          apartments.map(async (apt) => {
            try {
              const reviewRes = await API.get(`/reviews/${apt._id}`);
              return { ...apt, reviewCount: reviewRes.data.reviews.length };
            } catch (err) {
              console.error(`Error fetching reviews for apartment ${apt._id}`);
              return { ...apt, reviewCount: 0 };
            }
          })
        );

        setApartments(apartmentsWithCounts);
      } catch (err) {
        console.error("Error loading your apartments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();

    const interval = setInterval(() => {
      fetchApartments();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this apartment?"
    );
    if (!confirm) return;

    try {
      await API.delete(`/apartments/${id}`);
      setApartments((prev) => prev.filter((apt) => apt._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete apartment");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Properties</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/apartments/new")}
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Add New Property
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr className="text-left">
            <th>Property</th>
            <th>Status</th>
            <th>Reviews</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map((apt) => (
            <tr key={apt._id} className="hover align-top">
              <td className="flex items-center gap-4 py-4">
                <img
                  src={apt.image}
                  alt={apt.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <p className="font-semibold">{apt.title}</p>
                  <p className="text-sm text-gray-500">{apt.address}</p>
                </div>
              </td>

              <td className="py-4">
                <span
                  className={`badge ${
                    apt.isActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {apt.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="py-4 text-gray-700">{apt.reviewCount ?? 0}</td>

              <td className="py-4 text-yellow-500">
                <div className="flex items-center justify-start gap-1">
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  {apt.rating || "-"}
                </div>
              </td>

              <td className="py-4">
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/apartments/edit/${apt._id}`)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(apt._id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyApartments;
