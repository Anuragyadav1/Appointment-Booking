import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!isAuthenticated()) {
    return (
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-brand">
            Appointment Booking
          </Link>
          <ul className="nav-menu">
            <li>
              <Link
                to="/login"
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`nav-link ${isActive("/register") ? "active" : ""}`}
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          Appointment Booking
        </Link>
        <ul className="nav-menu">
          {user?.role === "patient" && (
            <>
              <li>
                <Link
                  to="/patient"
                  className={`nav-link ${isActive("/patient") ? "active" : ""}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/patient/bookings"
                  className={`nav-link ${
                    isActive("/patient/bookings") ? "active" : ""
                  }`}
                >
                  My Bookings
                </Link>
              </li>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <li>
                <Link
                  to="/admin"
                  className={`nav-link ${isActive("/admin") ? "active" : ""}`}
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/bookings"
                  className={`nav-link ${
                    isActive("/admin/bookings") ? "active" : ""
                  }`}
                >
                  All Bookings
                </Link>
              </li>
            </>
          )}
          <li>
            <span className="nav-link">Welcome, {user?.name}</span>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ margin: 0 }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
