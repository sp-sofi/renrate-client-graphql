import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

const EditApartment = () => {
  const [form, setForm] = useState({
    title: "",
    address: "",
    price: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const res = await API.get(`/apartments/${id}`);
        setForm({
          title: res.data.title,
          address: res.data.address,
          price: res.data.price,
          description: res.data.description || "",
          image: res.data.image,
          isActive: res.data.isActive ?? true,
        });
      } catch (err) {
        console.error("Failed to fetch apartment:", err);
        alert("Failed to load apartment");
      } finally {
        setFetching(false);
      }
    };

    fetchApartment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put(`/apartments/${id}`, {
        ...form,
        price: Number(form.price),
      });

      navigate("/my-apartments");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update apartment");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Apartment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          className="input input-bordered w-full"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          className="input input-bordered w-full"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image"
          className="input input-bordered w-full"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          className="textarea textarea-bordered w-full"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        ></textarea>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              name="isActive"
              className="toggle toggle-primary"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span className="label-text font-medium">
              {form.isActive ? "Active" : "Inactive"}
            </span>
          </label>
        </div>

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Updating..." : "Update Apartment"}
        </button>
      </form>
    </div>
  );
};

export default EditApartment;
