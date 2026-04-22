import { useState } from "react";

function TaskCard({
  task,
  onDelete,
  onToggle,
  onSchedule,
  onUpdate,
  onUnschedule,
  onFocus,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const getPriorityStyles = () => {
    if (task.priority === "high")
      return "bg-red-50 text-red-600 border-red-100";
    if (task.priority === "medium")
      return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const tagColors = {
    study: "bg-blue-50 text-blue-600",
    fitness: "bg-emerald-50 text-emerald-600",
    work: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all hover:border-indigo-200">
      {/* Top Section: Content Area */}
      <div className="p-4">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 border-b-2 border-indigo-500 p-1 outline-none font-medium text-gray-800 bg-gray-50"
              autoFocus
            />
            <button
              onClick={() => {
                onUpdate(task._id, { title: newTitle });
                setIsEditing(false);
              }}
              className="px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        ) : (
          <p
            className={`text-base font-bold text-gray-800 ${task.status === "completed" ? "line-through text-gray-400" : ""}`}
          >
            {task.title}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getPriorityStyles()}`}
          >
            {task.priority}
          </span>
          {task.tags?.map((tag, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${tagColors[tag] || "bg-gray-100 text-gray-500"}`}
            >
              {tag}
            </span>
          ))}
          <button
            onClick={() => onFocus(task)}
          className={`text-[10px] cursor-pointer font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors`}
            >
            Focus
          </button>
        </div>
      </div>

      {/* Bottom Section: Grouped Buttons */}
      <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        {/* Group 1: General Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={() => onToggle(task)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${task.status === "completed" ? "bg-white text-gray-400 border-gray-200" : "bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50"}`}
          >
            {task.status === "completed" ? "Undo" : "Done"}
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-bold px-3 py-1.5 bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 rounded-lg"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-[11px] font-bold px-3 py-1.5 bg-white text-red-500 border border-red-100 hover:bg-red-50 rounded-lg"
          >
            Delete
          </button>
        </div>

        {/* Group 2: Planning Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              const time = prompt("Enter hour (9–21)");
              if (time) onSchedule(task, time);
            }}
            className="text-[11px] font-bold px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Schedule
          </button>

          <button
            onClick={() => onUnschedule(task)}
            className="text-[11px] font-bold px-3 py-1.5 bg-white text-gray-400 border border-gray-200 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Unschedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
