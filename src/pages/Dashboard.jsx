import { useState } from "react";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import Planner from "../components/Planner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import FocusMode from "../components/FocusMode";

function Dashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tag, setTag] = useState("study");
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [startHour, setStartHour] = useState(() => {
    const saved = localStorage.getItem("startHour");
    return saved ? Number(saved) : 9; // Default to 9 if nothing is saved
  });
  const [endHour, setEndHour] = useState(() => {
    const saved = localStorage.getItem("endHour");
    return saved ? Number(saved) : 21; // Default to 21 if nothing is saved
  });
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

  useEffect(() => {
    localStorage.setItem("startHour", startHour);
    localStorage.setItem("endHour", endHour);
  }, [startHour, endHour]);

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Daily Manager
            </h1>
            <p className="text-gray-500 mt-1">
              Organize your workflow and stay productive.
            </p>
          </div>
          <div className="hidden md:block text-sm font-medium text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Tasks Sidebar (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                Quick Add
              </h2>

              <div className="space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />

                <div className="flex gap-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 bg-gray-50 border-none p-2.5 rounded-lg text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="flex-1 bg-gray-50 border-none p-2.5 rounded-lg text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <option value="study">Study</option>
                    <option value="fitness">Fitness</option>
                    <option value="work">Work</option>
                  </select>
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
                >
                  Add Task
                </button>
              </div>
            </section>

            {/* Task List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Inbox
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                  {tasks.length}
                </span>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={deleteTask}
                      onToggle={toggleTask}
                      onSchedule={scheduleTask}
                      onUpdate={updateTask}
                      onUnschedule={unscheduleTask}
                      onFocus={setActiveTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Planner (8 columns) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-150">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Daily Timeline
                </h2>

                {/* Time Controls */}
                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="bg-transparent text-sm font-semibold text-gray-600 focus:outline-none p-1"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}:00
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-300">to</span>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className="bg-transparent text-sm font-semibold text-gray-600 focus:outline-none p-1"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-gray-50">
                <Planner
                  tasks={tasks}
                  onSchedule={scheduleTask}
                  startHour={startHour}
                  endHour={endHour}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeTask && (
        <FocusMode task={activeTask} onExit={() => setActiveTask(null)} />
      )}
    </div>
  );
}

export default Dashboard;
