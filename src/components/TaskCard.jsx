function TaskCard({ task, onDelete, onToggle, onSchedule }) {
  
  const getPriorityStyles = () => {
    if (task.priority === "high") return "bg-red-100 text-red-600";
    if (task.priority === "medium") return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
      {/* Left */}
      <div>
        <p
          className={`font-medium ${
            task.status === "completed" ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </p>

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
          onClick={() => {
            const time = prompt("Enter hour (9–21)");
            if (!time) return;

            onSchedule(task, time);
          }}
          className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
        >
          Schedule
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
