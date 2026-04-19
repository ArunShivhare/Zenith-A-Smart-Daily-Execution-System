import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Step 1: Google login
      const result = await signInWithPopup(auth, provider);

      // Step 2: Get token
      const token = await result.user.getIdToken();

      // Step 3: Send token to backend
      const res = await axios.get("http://localhost:5000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      // Step 4: Save token (temporary)
      localStorage.setItem("token", token);

      // Step 5: Redirect
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Continue with Google
      </button>
    </div>
  );
}

export default Login;