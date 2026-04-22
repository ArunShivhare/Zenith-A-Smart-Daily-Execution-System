import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>

      {/* Navbar always visible except login */}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/habits" element={<Habits />} />
              </Routes>
            </>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;