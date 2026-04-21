import { useState } from "react";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import Planner from "../components/Planner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

function Dashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("study");
  const [loading, setLoading] = useState(true);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(21);
  const {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
    scheduleTask,
    updateTask,
    unscheduleTask,
  } = useTasks(!loading);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      } else {
        setLoading(false); // ✅ user ready
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAdd = () => {
    if (!title) return;

    addTask({
      title,
      priority,
      tags: [tag],
    });

    setTitle("");
    setPriority("medium");
  };

  useEffect(() => {
    if (startHour >= endHour) {
      setEndHour(startHour + 1);
    }
  }, [startHour, endHour]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daily Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Tasks */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>

          {/* Add Task */}
          <div className="flex flex-col gap-2 mb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task..."
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="study">Study</option>
                <option value="fitness">Fitness</option>
                <option value="work">Work</option>
              </select>

              <button
                onClick={handleAdd}
                className="bg-black text-white px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>

          {tasks.length === 0 && (
            <p className="text-sm text-gray-400">No tasks yet</p>
          )}

          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleTask}
                onSchedule={scheduleTask}
                onUpdate={updateTask}
                onUnschedule={unscheduleTask}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Planner */}
        <div className="md:col-span-2">
          {/* Time Controls */}
          <div className="flex gap-3 mb-3">
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  Start: {i}:00
                </option>
              ))}
            </select>

            <select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  End: {i}:00
                </option>
              ))}
            </select>
          </div>

          <Planner
            tasks={tasks}
            onSchedule={scheduleTask}
            startHour={startHour}
            endHour={endHour}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
