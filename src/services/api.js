import axios from "axios";
import { auth } from "./firebase";

const API = axios.create({
  baseURL: "https://zenith-backend-iydz.onrender.com/api",
});

API.interceptors.request.use(async (req) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(); // 🔥 fresh token every time
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;