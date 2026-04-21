import axios from "axios";
import { auth } from "./firebase";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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