import { useDroppable } from "@dnd-kit/core";

function TimeSlot({ hour, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: hour.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      className={`border p-2 min-h-17.5 rounded ${
        isOver ? "bg-blue-100" : ""
      }`}
    >
      <div className="text-xs text-gray-500 mb-1">
        {hour}:00
      </div>

      {children}
    </div>
  );
}

export default TimeSlot;