import { Link, useLocation } from "react-router-dom";
import { auth } from "../services/firebase";

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `px-4 py-2 rounded ${
      location.pathname === path
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-200"
    }`;

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="w-full border-b bg-white px-6 py-3 flex justify-between items-center">
      
      {/* Left: Logo */}
      <h1 className="text-xl font-bold">Zenith</h1>

      {/* Center: Navigation */}
      <div className="flex gap-3">
        <Link to="/dashboard" className={linkStyle("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/habits" className={linkStyle("/habits")}>
          Habits
        </Link>
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="text-sm px-3 py-1 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;