import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Browse = () => {
  const [allApartments, setAllApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    sort: "recent",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    maxRating: "",
  });

  const [page, setPage] = useState(1);
  const apartmentsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const res = await API.post(
          "",
          {
            query: `
              query {
                apartments {
                  id
                  title
                  address
                  image
                  rating
                  createdAt
                }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllApartments(res.data.data.apartments);
      } catch (err) {
        console.error("Error loading apartments:", err);
      }
    };

    fetchAll();

    // Оновлення кожні 5 секунд
    const interval = setInterval(() => {
      fetchAll();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let result = [...allApartments];
    let shouldResetPage = false;

    if (filters.search) {
      result = result.filter((apt) =>
        apt.title.toLowerCase().includes(filters.search.toLowerCase())
      );
      shouldResetPage = true;
    }

    if (filters.minPrice) {
      result = result.filter((apt) => apt.price >= parseInt(filters.minPrice));
      shouldResetPage = true;
    }

    if (filters.maxPrice) {
      result = result.filter((apt) => apt.price <= parseInt(filters.maxPrice));
      shouldResetPage = true;
    }

    if (filters.minRating) {
      result = result.filter(
        (apt) => apt.rating >= parseFloat(filters.minRating)
      );
      shouldResetPage = true;
    }

    if (filters.maxRating) {
      result = result.filter(
        (apt) => apt.rating <= parseFloat(filters.maxRating)
      );
      shouldResetPage = true;
    }

    if (filters.sort === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "highRating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === "lowRating") {
      result.sort((a, b) => a.rating - b.rating);
    }

    setFilteredApartments(result);
    if (shouldResetPage) {
      setPage(1);
    }
  }, [filters, allApartments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const paginated = filteredApartments.slice(
    (page - 1) * apartmentsPerPage,
    page * apartmentsPerPage
  );

  const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);

  return (
    <div className="flex gap-8 bg-base-200 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-lg p-4 shadow">
        <h2 className="font-bold text-lg mb-4">Search</h2>

        <input
          name="search"
          type="text"
          placeholder="Search by title..."
          className="input input-bordered w-full mb-3"
          value={filters.search}
          onChange={handleChange}
        />
        <h2 className="font-bold text-lg mt-4">Filters</h2>
        <div className="mb-3">
          <label className="label">Rating (1 - 5)</label>
          <div className="flex gap-2">
            <input
              name="minRating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="Min"
              className="input input-bordered w-full"
              value={filters.minRating}
              onChange={handleChange}
            />
            <input
              name="maxRating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="Max"
              className="input input-bordered w-full"
              value={filters.maxRating}
              onChange={handleChange}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Available Rentals</h2>

          <select
            name="sort"
            className="select select-bordered"
            value={filters.sort}
            onChange={handleChange}
          >
            <option value="recent">Most Recent</option>
            <option value="highRating">Highest Rating</option>
            <option value="lowRating">Lowest Rating</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((apt) => (
            <div
              key={apt.id}
              className="card bg-white p-4 shadow rounded-lg cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/apartments/${apt.id}`)}
            >
              <img
                src={apt.image}
                alt={apt.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{apt.title}</h3>
              <p className="text-gray-600">{apt.address}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                {apt.rating ? (
                  <>
                    <span className="material-symbols-outlined text-yellow-500">
                      star
                    </span>
                    <span>{apt.rating}</span>
                  </>
                ) : (
                  <span>No rating yet</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-2 flex justify-center gap-2">
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button className="btn btn-primary btn-active">{page}</button>
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
