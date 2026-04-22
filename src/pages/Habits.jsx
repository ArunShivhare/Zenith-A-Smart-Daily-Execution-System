import { useState, useEffect } from "react";
import useHabits from "../hooks/useHabits";
import HabitHeatmap from "../components/HabitHeatmap";
import { auth } from "../services/firebase";
import { Plus, Flame, Check, Trash2, Trophy, Edit2, Save, X, Target, Calendar } from "lucide-react";

function Habits() {
  const [userReady, setUserReady] = useState(false);
  const { habits, addHabit, toggleHabit, deleteHabit, updateHabit } = useHabits(userReady);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserReady(true);
    });
    return () => unsubscribe();
  }, []);

  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
  };

  const calculateStreaks = (dates) => {
    if (!dates.length) return { current: 0, longest: 0 };
    const sorted = dates.map((d) => new Date(d)).sort((a, b) => a - b);
    let longest = 0, streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else if (diff > 1) streak = 1;
      longest = Math.max(longest, streak);
    }
    let current = 0;
    let checkDate = new Date();
    for (let i = sorted.length - 1; i >= 0; i--) {
      const diff = (checkDate - sorted[i]) / (1000 * 60 * 60 * 24);
      if (Math.floor(diff) === current) current++;
      else break;
    }
    return { current, longest: Math.max(longest, current) };
  };

  const getMotivation = (streak) => {
    if (streak === 0) return "Every journey begins with a single step. Start today!";
    if (streak < 3) return "Solid start! Momentum is your best friend right now.";
    if (streak < 7) return "You're building a real pattern. Don't break the chain!";
    if (streak < 14) return "Two weeks in! You're rewriting your brain's defaults.";
    return "Absolute legend! You've mastered the art of showing up.";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Habit Tracker</h1>
            <p className="text-gray-500 font-medium mt-1">Consistency is the bridge between goals and accomplishment.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Target size={20}/></div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Habits</p>
                <p className="text-xl font-black text-gray-800">{habits.length}</p>
             </div>
          </div>
        </header>

        <div className="bg-white p-2 rounded-3xl shadow-xl shadow-indigo-100/20 border border-gray-100 flex gap-2 mb-10 group transition-all hover:border-indigo-200">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your next big goal?"
            className="flex-1 bg-transparent px-6 py-3 outline-none text-gray-700 font-semibold placeholder:text-gray-300"
          />
          <button
            onClick={() => { if (!title) return; addHabit(title); setTitle(""); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-200"
          >
            <Plus size={20} />
            <span className="hidden md:block">Add Habit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {habits.map((habit) => {
            const doneToday = habit.completedDates.includes(today);
            const { current, longest } = calculateStreaks(habit.completedDates);
            const last7 = getLast7Days();
            const weeklyCount = last7.filter((d) => habit.completedDates.includes(d)).length;
            const percentage = Math.min(Math.round((habit.completedDates.length / 30) * 100), 100);

            return (
              <div key={habit._id} className="bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden flex flex-col xl:flex-row transition-all hover:shadow-md">
                
                {/* LEFT SECTION: Identity, Stats & Motivation */}
                <div className="p-8 flex-1 border-b xl:border-b-0 xl:border-r border-gray-50 flex flex-col justify-between min-w-0">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-4">
                        {editingId === habit._id ? (
                          <div className="flex gap-2 mb-2">
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border-b-2 border-indigo-500 bg-gray-50 p-2 rounded outline-none font-bold text-xl"
                              autoFocus
                            />
                            <button onClick={() => { updateHabit(habit._id, editText); setEditingId(null); }} className="p-2 text-emerald-500"><Save size={20}/></button>
                            <button onClick={() => setEditingId(null)} className="p-2 text-gray-400"><X size={20}/></button>
                          </div>
                        ) : (
                          <h3 className="text-3xl font-black text-gray-800 truncate leading-tight group flex items-center gap-2">
                            {habit.title}
                            <button 
                              onClick={() => { setEditingId(habit._id); setEditText(habit.title); }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-indigo-500 transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                          </h3>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${current > 0 ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                              <Flame size={12} /> {current} Day Streak
                           </div>
                           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                              <Trophy size={12} /> Best: {longest}
                           </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleHabit(habit._id)}
                        className={`h-16 w-16 rounded-3xl flex flex-col items-center justify-center transition-all ${
                          doneToday 
                          ? "bg-emerald-500 text-white shadow-xl shadow-emerald-100" 
                          : "bg-white text-gray-300 border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:text-emerald-500"
                        }`}
                      >
                        <Check size={28} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase mt-1">{doneToday ? "Done" : "Mark"}</span>
                      </button>
                    </div>

                    {/* MOTIVATION BOX */}
                    <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100/20">
                      <p className="text-sm font-medium text-indigo-900/70 italic">
                        "{getMotivation(current)}"
                      </p>
                    </div>

                    {/* MOVED STATS GRID */}
                    <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Weekly Focus</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-gray-800">{weeklyCount}</span>
                          <span className="text-gray-300 font-bold text-sm">/ 7 days</span>
                        </div>
                      </div>
                      <div className="border-l border-gray-200 pl-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Total Effort</p>
                        <span className="text-2xl font-black text-gray-800">{habit.completedDates.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-8">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">30-Day Consistency</span>
                      <span className="text-lg font-black text-indigo-600">{percentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(79,70,229,0.3)]" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT SECTION: Progress Landscape */}
                <div className="p-8 bg-gray-50/30 flex flex-col xl:w-110 shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Progress Landscape
                    </span>
                    <button 
                      onClick={() => { if(window.confirm('Delete habit?')) deleteHabit(habit._id) }} 
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <HabitHeatmap completedDates={habit.completedDates} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Habits;
