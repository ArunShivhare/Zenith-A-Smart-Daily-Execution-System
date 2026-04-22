import { useEffect, useState } from "react";
import API from "../services/api";

export default function useHabits(userReady) {
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    const res = await API.get("/habits");
    setHabits(res.data);
  };

  const addHabit = async (title) => {
    const res = await API.post("/habits", { title });
    setHabits((prev) => [...prev, res.data]);
  };

  const toggleHabit = async (id) => {
    const res = await API.put(`/habits/${id}/toggle`);

    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
  };

  const deleteHabit = async (id) => {
    await API.delete(`/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h._id !== id));
  };

  const updateHabit = async (id, title) => {
    const res = await API.put(`/habits/${id}`, { title });

    setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
  };

  useEffect(() => {
    if (userReady) fetchHabits();
  }, [userReady]);

  useEffect(() => {
    if (!userReady) return;

    fetchHabits();
  }, [userReady]);

  return { habits, addHabit, toggleHabit, deleteHabit, updateHabit };
}
