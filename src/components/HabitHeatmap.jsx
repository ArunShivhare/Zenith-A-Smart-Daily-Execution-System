import React from 'react';

// Wrap the whole component in React.memo to optimize and satisfy ESLint 
// if you have other exports in the same file.
const HabitHeatmap = ({ completedDates }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // 1. Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();
  
  // 2. NEW: Find which day of the week the month starts on (0=Sun, 1=Mon, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // 3. Create the arrays
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Month Header */}
      <div className="flex justify-between items-center px-1">
        <span className="text-sm font-black text-gray-800 uppercase tracking-widest">
          {now.toLocaleString('default', { month: 'long' })}
        </span>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600 shadow-sm" />
            <span className="text-[9px] font-bold text-gray-400 uppercase">Done</span>
          </div>
        </div>
      </div>

      {/* The Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday Labels */}
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className="text-[10px] font-black text-gray-300 text-center mb-1">{d}</div>
        ))}

        {/* NEW: Empty slots to align the 1st of the month correctly */}
        {blanks.map((b) => (
          <div key={`blank-${b}`} className="aspect-square" />
        ))}

        {monthDays.map((dayNum) => {
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isDone = completedDates.includes(dateString);
          const isToday = dayNum === todayDate;
          const isFuture = dayNum > todayDate;

          return (
            <div
              key={dayNum}
              className={`
                aspect-square rounded-xl transition-all duration-300
                flex items-center justify-center text-xs font-bold relative
                ${isDone 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-105" 
                  : isFuture 
                    ? "bg-gray-50 text-gray-200 border border-gray-100 opacity-40" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"}
                ${isToday ? "ring-2 ring-indigo-500 ring-offset-2 z-10" : ""}
                ${isToday && !isDone ? "bg-white text-indigo-600 border-2 border-indigo-500 shadow-lg shadow-indigo-50" : ""}
              `}
            >
              {dayNum}
            </div>
          );
        })}
      </div>
      
      <p className="text-[10px] text-center text-gray-400 font-medium bg-gray-50/50 py-2 rounded-xl border border-dashed border-gray-100">
        {daysInMonth - todayDate} days remaining in {now.toLocaleString('default', { month: 'long' })}
      </p>
    </div>
  );
};

export default HabitHeatmap;
