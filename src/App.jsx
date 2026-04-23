import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import FocusMode from "./components/FocusMode";
import { useNavigate } from "react-router-dom";
import { auth } from "./services/firebase";
import DailyReview from "./pages/DailyReview";
import Analytics from "./pages/Analytics";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {

    if (!user) {
      navigate("/");
    }

    // ✅ BOTH STATES FIXED HERE
    setUserReady(true);
    setLoading(false);
  });

  return () => unsubscribe();
}, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          {/* Modern Rounded Spinner */}
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-2xl animate-spin" />

          {/* Subtle Text */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold text-gray-700 tracking-wide uppercase">
              Daily Manager
            </p>
            <p className="text-xs text-gray-400 animate-pulse font-medium">
              Syncing your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Navbar always visible except login */}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="*"
          element={
            <>
              <Navbar
                onFocus={() =>
                  setActiveTask({ title: "General Focus Session" })
                }
              />
              <Routes>
                <Route
                  path="/dashboard"
                  element={<Dashboard setActiveTask={setActiveTask} userReady={userReady}/>}
                />

                <Route path="/review" element={<DailyReview userReady={userReady}/>} />
                <Route path="/habits" element={<Habits userReady={userReady}/>} />
                <Route path="/analytics" element={<Analytics userReady={userReady}/>} />
              </Routes>
            </>
          }
        />
      </Routes>
      {activeTask && (
        <FocusMode task={activeTask} onExit={() => setActiveTask(null)} />
      )}
    </>
  );
}

export default App;
