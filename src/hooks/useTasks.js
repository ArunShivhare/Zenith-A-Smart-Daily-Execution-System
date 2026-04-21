import { useEffect, useState } from "react";
import API from "../services/api";

export default function useTasks(userReady) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (taskData) => {
    try {
      const res = await API.post("/tasks", taskData);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const updated = await API.put(`/tasks/${task._id}`, {
        status: task.status === "completed" ? "pending" : "completed",
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated.data : t)),
      );
    } catch (err) {
      console.error(err);
    }
  };

 const scheduleTask = async (task, hour) => {
  try {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(0);

    const res = await API.put(`/tasks/${task._id}`, {
      scheduledTime: date,
    });

    // 🔥 Force proper update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? { ...res.data } // ensure new reference
          : t
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  const updateTask = async (id, data) => {
    try {
      const res = await API.put(`/tasks/${id}`, data);

      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const unscheduleTask = async (task) => {
  try {
    const res = await API.put(`/tasks/${task._id}`, {
      scheduledTime: null,
    });

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? res.data : t))
    );
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    if (userReady) {
      fetchTasks();
    }
  }, [userReady]);

  return { tasks, addTask, fetchTasks, deleteTask, toggleTask, scheduleTask, updateTask, unscheduleTask };
}
