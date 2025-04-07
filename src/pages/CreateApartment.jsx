import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const CreateApartment = () => {
  const [form, setForm] = useState({
    title: "",
    address: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/graphql", {
        query: `
          mutation CreateApartment($input: ApartmentInput!) {
            createApartment(input: $input) {
              id
              title
            }
          }
        `,
        variables: {
          input: {
            title: form.title,
            address: form.address,
            description: form.description,
            image: form.image,
          },
        },
      });

      console.log("Apartment created:", res.data.data.createApartment);

      const channel = new BroadcastChannel("apartments_channel");
      channel.postMessage("apartment_added");
      channel.close();

      navigate("/my-apartments");
    } catch (err) {
      alert(
        err.response?.data?.errors?.[0]?.message || "Failed to create apartment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Apartment</h2>
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

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Apartment"}
        </button>
      </form>
    </div>
  );
};

export default CreateApartment;
