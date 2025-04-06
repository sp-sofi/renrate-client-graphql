import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Отримаємо токен і декодуємо з localStorage або зберігай user у Context
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 text-base-content shadow-sm px-8">
      <div className="flex-1">
        <Link to="/browse" className="text-2xl font-bold text-primary">
          RentRate
        </Link>
      </div>

      {user && (
        <div className="hidden md:flex gap-6 text-base font-medium">
          <Link to="/browse" className="hover:text-primary">
            Browse
          </Link>

          {user.role === "landlord" && (
            <>
              <Link to="/apartments/new" className="hover:text-primary">
                Create Apartment
              </Link>
              <Link to="/my-apartments" className="hover:text-primary">
                My Apartments
              </Link>
            </>
          )}
        </div>
      )}

      <div className="flex gap-3 ml-6">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm normal-case">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline btn-primary"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
