import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities"; // Use this for cleaner transforms

function DraggableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : undefined, // Keep it above everything
    position: isDragging ? "relative" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      /* Added 'touch-none' to prevent scrolling while dragging and conditional transition */
      className={`group flex items-center justify-between p-3 mb-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md cursor-grab active:cursor-grabbing active:scale-95 touch-none ${
        isDragging ? "opacity-50 ring-2 ring-indigo-500" : "transition-all"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={`w-1.5 h-6 rounded-full shrink-0 ${
            task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />
        <span className="text-sm font-semibold text-gray-700 truncate">
          {task.title}
        </span>
      </div>
      {/* Updated SVG Path to fix the "Wait 4" text bug in your code */}
      <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>
  );
}

export default DraggableTask;
