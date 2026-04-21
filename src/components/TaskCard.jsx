import { useState } from "react";

function TaskCard({ task, onDelete, onToggle, onSchedule, onUpdate, onUnschedule }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const getPriorityStyles = () => {
    if (task.priority === "high") return "bg-red-100 text-red-600";
    if (task.priority === "medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  const tagColors = {
    study: "bg-blue-100 text-blue-600",
    fitness: "bg-green-100 text-green-600",
    work: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
      {/* Left */}
      <div>
        {isEditing ? (
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border p-1 rounded"
          />
        ) : (
          <p>{task.title}</p>
        )}

        <div className="flex gap-2 mt-1">
          {task.tags?.map((tag, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-1 rounded ${tagColors[tag] || "bg-gray-200 text-gray-600"}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <span className={`text-xs px-2 py-1 rounded ${getPriorityStyles()}`}>
          {task.priority}
        </span>
      </div>

      {/* Right */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggle(task)}
          className="text-sm px-2 py-1 bg-gray-200 rounded"
        >
          {task.status === "completed" ? "Undo" : "Done"}
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="text-sm px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>

        <button
          onClick={() => setIsEditing(true)}
          className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={() => {
            const time = prompt("Enter hour (9–21)");
            if (!time) return;

            onSchedule(task, time);
          }}
          className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
        >
          Schedule
        </button>

        <button
          onClick={() => onUnschedule(task)}
          className="text-sm px-2 py-1 bg-gray-500 text-white rounded"
        >
          Unschedule
        </button>

        {isEditing && (
          <button
            onClick={() => {
              onUpdate(task._id, { title: newTitle });
              setIsEditing(false);
            }}
            className="text-sm px-2 py-1 bg-green-500 text-white rounded"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
