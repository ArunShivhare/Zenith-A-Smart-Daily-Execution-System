import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import FocusMode from "./components/FocusMode";

function App() {
  const [activeTask, setActiveTask] = useState(null);

  return (
    <BrowserRouter>
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
                  element={<Dashboard setActiveTask={setActiveTask} />}
                />
                <Route path="/habits" element={<Habits />} />
              </Routes>
            </>
          }
        />
      </Routes>
      {activeTask && (
        <FocusMode task={activeTask} onExit={() => setActiveTask(null)} />
      )}
    </BrowserRouter>
  );
}

export default App;
