import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("", {
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `,
        variables: { email, password },
      });

      const token = response.data.data.login;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email }));

      navigate("/browse");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.errors?.[0]?.message || "Login error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-white shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-primary">
          Welcome to RentRate
        </h2>
        <p className="text-center mb-4">Find your perfect rental home</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary w-full">
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account yet?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
