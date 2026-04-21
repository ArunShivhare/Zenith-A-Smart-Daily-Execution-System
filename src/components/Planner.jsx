import { DndContext, DragOverlay } from "@dnd-kit/core"; // 1. Import DragOverlay
import { useState } from "react"; // 2. Need state to track active task
import DraggableTask from "./DraggableTask";
import TimeSlot from "./TimeSlot";

function Planner({ tasks, onSchedule, startHour, endHour }) {
  const [activeTask, setActiveTask] = useState(null); // 3. State for the moving task

  const hours = Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
  const formatHour = (h) => h > 12 ? `${h - 12} PM` : h === 12 ? "12 PM" : `${h} AM`;
  const unscheduledTasks = tasks.filter((t) => !t.scheduledTime);

  const getTasksForHour = (hour) => {
    return tasks.filter((t) => {
      if (!t.scheduledTime) return false;
      const taskHour = new Date(t.scheduledTime).getHours();
      return Number(taskHour) === Number(hour);
    });
  };

  // 4. Capture the task when drag starts
  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null); // 5. Clear active task
    if (!over) return;

    const taskId = active.id;
    const hour = parseInt(over.id);
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    onSchedule(task, hour);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: UNSCHEDULED */}
        <div className="bg-gray-50/50 border border-gray-200 p-5 rounded-2xl">
           {/* ... Keep your existing Unscheduled header and mapping ... */}
           <div className="space-y-1 max-h-150 overflow-y-auto pr-1">
             {unscheduledTasks.map((task) => (
               <DraggableTask key={task._id} task={task} />
             ))}
           </div>
        </div>

        {/* RIGHT COLUMN: SCHEDULE */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
           {/* ... Keep your Schedule header ... */}
           <div className="space-y-3 relative z-0">
             {hours.map((hour) => (
               <TimeSlot key={hour} hour={hour} formatHour={formatHour}>
                 <div className="min-h-10 flex flex-col gap-2">
                   {getTasksForHour(hour).map((task) => (
                     <div key={task._id} className="group flex items-center px-3 py-2 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg text-indigo-700 shadow-sm">
                       <span className="text-xs font-bold truncate">{task.title}</span>
                     </div>
                   ))}
                 </div>
               </TimeSlot>
             ))}
           </div>
        </div>
      </div>

      {/* 6. THE FIX: This renders the task ABOVE all columns while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="p-3 bg-white border-2 border-indigo-500 rounded-xl shadow-2xl scale-105 opacity-90 cursor-grabbing">
             <div className="flex items-center gap-3">
                <div className={`w-1.5 h-6 rounded-full ${activeTask.priority === "high" ? "bg-red-500" : "bg-emerald-500"}`} />
                <span className="text-sm font-bold text-gray-700">{activeTask.title}</span>
             </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Planner;
