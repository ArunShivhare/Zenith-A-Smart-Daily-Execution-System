import { Link, useLocation } from "react-router-dom";
import { auth } from "../services/firebase";
import { LayoutDashboard, Flame, LogOut, Zap } from "lucide-react"; // Matching the modern vibe

function Navbar({ onFocus }) {
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
            <img className="w-5 h-5 invert-100" src="zenith.png" alt="Zenith Logo" />
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

      {/* Right: Profile/Logout/Focus */}
<div className="flex items-center gap-3">
  
  {/* Focus Mode Button - Highlighted Action */}
  <button
    onClick={onFocus}
    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-indigo-100 active:scale-95 group"
  >
    <div className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-200 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
    </div>
    Focus
  </button>

  <div className="h-6 w-px bg-gray-100 mx-1" /> {/* Vertical Divider */}

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
