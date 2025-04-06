import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, role } = form;

      await API.post("", {
        query: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              id
              name
              email
            }
          }
        `,
        variables: {
          input: { name, email, password, role },
        },
      });

      alert("Registration successful! Check your email to verify.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      alert(err.response?.data?.errors?.[0]?.message || "Registration error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-white shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-primary">
          Sign up for RentRate
        </h2>
        <p className="text-center mb-4">
          Create your account to find rentals or list yours
        </p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="input input-bordered w-full mb-4"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full mb-4"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered w-full mb-4"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            className="select select-bordered w-full mb-6"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="tenant">I want to rent</option>
            <option value="landlord">I want to list apartments</option>
          </select>

          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
