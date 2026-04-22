import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../services/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const provider = new GoogleAuthProvider();

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const res = await axios.get("http://localhost:5000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 text-center">
        {/* Logo/Icon Placeholder */}
        <div className="w-18 h-18 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white text-2xl w-12 font-bold"><img className="invert-100 w-full h-full object-contain" src="zenith.png" alt="Zenith Logo" /></span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 mb-10">
          Log in to manage your daily tasks and schedule effectively.
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98] shadow-sm"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="mt-8 text-xs text-gray-400">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}

export default Login;