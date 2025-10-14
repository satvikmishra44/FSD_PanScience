import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  // Highlight the current route
  const getActiveClass = (path) =>
    location.pathname === path
      ? "bg-indigo-600 text-white"
      : "hover:bg-indigo-100 dark:hover:bg-gray-700";

  // Theme toggle handler
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };


  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-xl font-semibold cursor-pointer"
          >
            TaskManager
          </h1>

          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md font-medium transition ${getActiveClass(
                "/dashboard"
              )}`}
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className={`px-3 py-2 rounded-md font-medium transition ${getActiveClass(
                "/tasks"
              )}`}
            >
              Tasks
            </Link>
            {currentUser?.role === "admin" && (
              <Link
                to="/users"
                className={`px-3 py-2 rounded-md font-medium transition ${getActiveClass(
                  "/users"
                )}`}
              >
                Users
              </Link>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            🌓
          </button>

          <div className="flex items-center gap-2">
            <span className="font-medium">{currentUser?.name || "User"}</span>
            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {currentUser?.role || "Member"}
            </span>
          </div>

          <button
            onClick={() => navigate('/logout')}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
