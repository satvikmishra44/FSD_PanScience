import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveClass = (path) =>
    location.pathname === path
      ? "bg-indigo-600 text-white"
      : "hover:bg-indigo-100 dark:hover:bg-gray-700";



  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-6">
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-xl font-semibold cursor-pointer hidden md:block"
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
            {currentUser?.role === "admin" && ( 
              <Link
                to="/tasks/admin"
                className={`px-3 py-2 rounded-md font-medium transition ${getActiveClass(
                  "/tasks/admin"
                )}`}
              >
                Tasks
              </Link>
              )}

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

        <div className="flex items-center gap-4">

          <div className="items-center gap-2 hidden md:block">
            <span className="text-lg mr-2 font-medium">{currentUser?.name || "User"}</span>
            <span className="text-lg px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {currentUser?.role || "User"}
            </span>
          </div>

          <button
            onClick={() => navigate('/logout')}
            className="px-3 py-1 rounded-md border border-red-300 dark:border-red-600 bg-red-400 text-white dark:hover:bg-red-800 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
