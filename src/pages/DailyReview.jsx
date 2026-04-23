import useTasks from "../hooks/useTasks";
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Zap,
  Award,
} from "lucide-react";

function DailyReview() {
  const { tasks } = useTasks(true);
  //   const today = new Date().toISOString().split("T")[0];
  const today = new Date().toLocaleDateString("en-CA");

  const todayTasks = tasks.filter((t) => {
    if (!t.scheduledTime) return false;

    // 1. Convert the stored UTC string into a local Date object
    const taskDate = new Date(t.scheduledTime);

    // 2. Format that specific task date to a local YYYY-MM-DD string
    const taskLocalDate = taskDate.toLocaleDateString("en-CA");

    // 3. Compare the local strings
    return taskLocalDate === today;
  });

  const completed = todayTasks.filter((t) => t.status === "completed");
  const pending = todayTasks.filter((t) => t.status !== "completed");
  const score = todayTasks.length
    ? Math.round((completed.length / todayTasks.length) * 100)
    : 0;

  const getFeedback = () => {
    if (score === 100)
      return {
        msg: "Elite Performance",
        sub: "You dominated the day.",
        icon: <Award className="text-emerald-500" />,
        color: "text-emerald-600",
      };
    if (score >= 75)
      return {
        msg: "Highly Productive",
        sub: "Small adjustments for perfection.",
        icon: <TrendingUp className="text-indigo-500" />,
        color: "text-indigo-600",
      };
    if (score >= 40)
      return {
        msg: "Room for Growth",
        sub: "Let's focus on deep work tomorrow.",
        icon: <Target className="text-amber-500" />,
        color: "text-amber-600",
      };
    return {
      msg: "Rough Day",
      sub: "Simplify your list for tomorrow.",
      icon: <Zap className="text-red-500" />,
      color: "text-red-600",
    };
  };

  const feedback = getFeedback();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Daily Review
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Reflect on your progress to build a better tomorrow.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* LEFT: Score Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">
                Productivity Score
              </span>

              {/* Circular Progress */}
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * score) / 100}
                    className={`${score > 70 ? "text-emerald-500" : "text-indigo-600"} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-4xl font-black text-gray-800">
                  {score}%
                </span>
              </div>

              <div
                className={`p-4 rounded-2xl bg-gray-50 border border-gray-100 w-full`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {feedback.icon}
                  <h3
                    className={`font-black uppercase text-xs tracking-widest ${feedback.color}`}
                  >
                    {feedback.msg}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {feedback.sub}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Completed
                </p>
                <p className="text-2xl font-black text-emerald-600">
                  {completed.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Missed
                </p>
                <p className="text-2xl font-black text-red-400">
                  {pending.length}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Task Breakdown */}
          <div className="md:col-span-7 bg-white rounded-4xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              Timeline Audit
            </h2>

            <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
              {todayTasks.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 font-medium">
                    No scheduled tasks reviewed today.
                  </p>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${task.status === "completed" ? "bg-emerald-50/30 border-emerald-100/50" : "bg-gray-50 border-gray-100"}`}
                  >
                    <div
                      className={
                        task.status === "completed"
                          ? "text-emerald-500"
                          : "text-gray-300"
                      }
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${task.status === "completed" ? "text-emerald-900/70 line-through" : "text-gray-700"}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        {new Date(task.scheduledTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyReview;
