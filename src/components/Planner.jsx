import { DndContext } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask";
import TimeSlot from "./TimeSlot";

function Planner({ tasks, onSchedule, startHour, endHour }) {
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => i + startHour,
  );

  const formatHour = (h) =>
    h > 12 ? `${h - 12} PM` : h === 12 ? "12 PM" : `${h} AM`;

  const unscheduledTasks = tasks.filter((t) => !t.scheduledTime);

const getTasksForHour = (hour) => {
  return tasks.filter((t) => {
    if (!t.scheduledTime) return false;

    const taskHour = new Date(t.scheduledTime).getHours();
    return Number(taskHour) === Number(hour);
  });
};

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const hour = parseInt(over.id);

    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    onSchedule(task, hour);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT: Tasks */}
        <div className="border p-3 rounded bg-white">
          <h2 className="font-semibold mb-3">Tasks</h2>

          {unscheduledTasks.map((task) => (
            <DraggableTask key={task._id} task={task} />
          ))}
        </div>

        {/* RIGHT: Planner */}
        <div className="border p-3 rounded bg-white">
          <h2 className="font-semibold mb-3">Planner</h2>

          <div className="space-y-2">
            {hours.map((hour) => (
              <TimeSlot key={hour} hour={hour} formatHour={formatHour}>
                {getTasksForHour(hour).map((task) => (
                  <div
                    key={task._id}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded mb-1"
                  >
                    {task.title}
                  </div>
                ))}
              </TimeSlot>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default Planner;
