import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FocusMode from "./components/FocusMode";
import { auth } from "./services/firebase";
import DailyReview from "./pages/DailyReview";
import Analytics from "./pages/Analytics";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [activeTask, setActiveTask] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 WAIT until Firebase finishes checking
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
      <Routes>
        {/* LOGIN ROUTE */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <>
                <Navbar onFocus={() => setActiveTask({ title: "Focus" })} />
                <Dashboard setActiveTask={setActiveTask} userReady={true} />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/habits"
          element={
            user ? (
              <>
                <Navbar onFocus={() => setActiveTask({ title: "Focus" })} />
                <Habits userReady={true} />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/review"
          element={
            user ? (
              <>
                <Navbar onFocus={() => setActiveTask({ title: "Focus" })} />
                <DailyReview userReady={true} />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/analytics"
          element={
            user ? (
              <>
                <Navbar onFocus={() => setActiveTask({ title: "Focus" })} />
                <Analytics userReady={true} />
              </>
            ) : (
              <Navigate to="/" />
            )
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
