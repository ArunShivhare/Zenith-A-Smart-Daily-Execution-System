import { Link, useLocation } from "react-router-dom";
import { auth } from "../services/firebase";
import { LayoutDashboard, Flame, LogOut, Zap } from "lucide-react"; // Matching the modern vibe

function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
      location.pathname === path
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
        : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
    }`;

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex justify-between items-center">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
          <Zap size={18} className="text-white fill-current" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tighter text-gray-900">
          Zenith
        </h1>
      </div>

      {/* Center: Navigation */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
        <Link to="/dashboard" className={linkStyle("/dashboard")}>
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <Link to="/habits" className={linkStyle("/habits")}>
          <Flame size={16} />
          Habits
        </Link>
      </div>

      {/* Right: Profile/Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
        >
          <span>Logout</span>
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;