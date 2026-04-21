import { useDroppable } from "@dnd-kit/core";

function TimeSlot({ hour, children, formatHour }) {
  const { setNodeRef, isOver } = useDroppable({
    id: hour.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex gap-4 p-3 border-b border-gray-100 transition-all ${
        isOver ? "bg-indigo-50/50" : "bg-transparent"
      }`}
    >
      {/* Left: Time Label */}
      <div className="w-16 pt-1 shrink-0">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
          {formatHour(hour)}
        </span>
      </div>

      {/* Right: Task Dropzone */}
      <div className="flex-1 min-h-12.5 flex flex-col gap-2">
        {children.length === 0 ? (
          <div
            className={`text-xs italic transition-opacity duration-300 ${isOver ? "opacity-0" : "text-gray-300"}`}
          >
            Free slot
          </div>
        ) : (
          children
        )}
      </div>

      {/* Visual "Drop Indicator" when hovering */}
      {isOver && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500 animate-pulse" />
      )}
    </div>
  );
}

export default TimeSlot;
