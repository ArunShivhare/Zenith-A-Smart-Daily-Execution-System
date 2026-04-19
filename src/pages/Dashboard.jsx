import { useState } from "react";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import Planner from "../components/Planner";

function Dashboard() {
  const { tasks, addTask, deleteTask, toggleTask, scheduleTask } = useTasks();
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title) return;

    addTask({
      title,
      priority: "medium",
    });

    setTitle("");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left: Tasks */}
      <div>
        <h1 className="text-xl font-bold mb-4">Your Tasks</h1>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            className="border p-2 flex-1 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-black text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onSchedule={scheduleTask}
            />
          ))}
        </div>
      </div>

      {/* Right: Planner */}
      <Planner tasks={tasks} onSchedule={scheduleTask} />
    </div>
  );
}

export default Dashboard;
