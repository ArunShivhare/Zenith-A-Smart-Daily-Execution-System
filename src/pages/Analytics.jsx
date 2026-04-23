import useTasks from "../hooks/useTasks";
import useHabits from "../hooks/useHabits";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Lightbulb,
  PieChart,
  Activity,
} from "lucide-react";

function Analytics() {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) setUserReady(true);
    });
    return () => unsub();
  }, []);

  const { tasks } = useTasks(userReady);
  const { habits } = useHabits(userReady);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // FIX 1: Generate list using LOCAL date strings
      days.push(d.toLocaleDateString("en-CA"));
    }
    return days;
  };

  const days = getLast7Days();

  const taskStats = days.map((day) => {
    // FIX 2: Convert task scheduledTime to local date string before comparing
    const dayTasks = tasks.filter((t) => {
      if (!t.scheduledTime) return false;
      return new Date(t.scheduledTime).toLocaleDateString("en-CA") === day;
    });

    const completed = dayTasks.filter((t) => t.status === "completed").length;

    return {
      // Use original 'day' string (YYYY-MM-DD) to get the weekday label
      day: new Date(day).toLocaleDateString("en-US", { weekday: "short" }),
      date: day.slice(5),
      total: dayTasks.length,
      completed,
    };
  });

  const bestDay = taskStats.reduce(
    (best, curr) => (curr.completed > best.completed ? curr : best),
    { completed: 0, day: "-" },
  );

  //   const today = new Date().toISOString().split("T")[0];
  const today = new Date().toLocaleDateString("en-CA");
  const habitScore =
    habits.length === 0
      ? 0
      : Math.round(
          (habits.reduce(
            (acc, h) => acc + (h.completedDates.includes(today) ? 1 : 0),
            0,
          ) /
            habits.length) *
            100,
        );

  const totalPlanned = taskStats.reduce((a, d) => a + d.total, 0);
  const totalDone = taskStats.reduce((a, d) => a + d.completed, 0);
  const weeklyScore =
    totalPlanned > 0 ? Math.round((totalDone / totalPlanned) * 100) : 0;

  let insights = [];
  if (bestDay.completed > 0)
    insights.push({
      text: `Peak performance hit on ${bestDay.day}`,
      icon: <TrendingUp className="text-emerald-500" />,
    });
  if (totalPlanned > 0) {
    const ratio = totalDone / totalPlanned;
    if (ratio < 0.5)
      insights.push({
        text: "Schedule looks heavy; try fewer tasks",
        icon: <Activity className="text-amber-500" />,
      });
    else if (ratio > 0.8)
      insights.push({
        text: "Exceptional planning accuracy",
        icon: <Activity className="text-emerald-500" />,
      });
  }
  if (habitScore > 80)
    insights.push({
      text: "Habit consistency is outstanding",
      icon: <PieChart className="text-indigo-500" />,
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Deep dive into your productivity patterns.
          </p>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Weekly Score",
              value: `${weeklyScore}%`,
              icon: <TrendingUp size={18} />,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Habit Consistency",
              value: `${habitScore}%`,
              icon: <PieChart size={18} />,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Best Day",
              value: bestDay.day,
              icon: <Calendar size={18} />,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Weekly Chart Card */}
          <div className="lg:col-span-8 bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-600" />
                Weekly Performance
              </h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Tasks Completed
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 h-64 px-2">
              {taskStats.map((d, i) => {
                const height = d.total > 0 ? (d.completed / d.total) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center group w-full max-w-10"
                  >
                    <div className="relative w-full bg-gray-100 rounded-full h-48 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-4 uppercase">
                      {d.day}
                    </span>
                    <span className="text-[9px] font-medium text-gray-300 mt-1">
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm h-full">
              <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-500" />
                Smart Insights
              </h2>

              <div className="space-y-4">
                {insights.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-400 italic">
                      Continue using Zenith to generate deep insights.
                    </p>
                  </div>
                ) : (
                  insights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-hover hover:border-indigo-100"
                    >
                      <div className="mt-1">{insight.icon}</div>
                      <p className="text-sm font-bold text-gray-700 leading-snug">
                        {insight.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
