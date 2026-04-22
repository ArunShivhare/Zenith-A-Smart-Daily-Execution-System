import { useEffect, useState } from "react";

function FocusMode({ task, onExit }) {
  const [duration, setDuration] = useState(25);
  const [time, setTime] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const playSound = () => {
    const audio = new Audio("/sound.mp3");
    audio.play().catch(() => console.log("Sound enabled after user interaction"));
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setSessions((s) => s + 1);
          playSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTime(duration * 60);
    setIsRunning(false);
  }, [duration]);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center transition-all duration-500 z-100">
      {/* Soft Ambient Background Glow */}
      <div className={`absolute w-150 h-150 rounded-full blur-[120px] transition-colors duration-1000 opacity-40 ${isRunning ? "bg-indigo-200" : "bg-gray-200"}`} />

      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-bold uppercase tracking-widest text-[10px] rounded-full mb-4">
            Focus Session
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            {task?.title || "Focus Session"}
          </h2>
          <p className="text-gray-400 font-medium italic">Stay in the flow.</p>
        </div>

        {/* Hero Timer Display */}
        <div className="relative flex flex-col items-center justify-center mb-8">
          <div className="text-[160px] font-black tracking-tighter leading-none select-none tabular-nums text-gray-900">
            {formatTime()}
          </div>
          {/* Progress Ring Subtly hidden or used as a bar */}
          <div className="w-full max-w-75 h-1.5 bg-gray-200 rounded-full mt-8 overflow-hidden">
             <div 
                className="h-full bg-indigo-600 transition-all duration-1000 ease-linear" 
                style={{ width: `${(time / (duration * 60)) * 100}%` }}
             />
          </div>
        </div>

        {/* Duration Controls */}
        <div className="flex gap-2 mb-12 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          {[25, 45, 60].map((min) => (
            <button
              key={min}
              onClick={() => setDuration(min)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${duration === min ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-400 hover:bg-gray-50"}`}
            >
              {min}m
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-6 mb-12">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-bold text-xl transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              Start Focus
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="px-12 py-5 bg-white border-2 border-gray-100 text-gray-700 rounded-3xl font-bold text-xl transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
            >
              Pause
            </button>
          )}

          <button
            onClick={() => { setTime(duration * 60); setIsRunning(false); }}
            className="p-5 bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 rounded-3xl transition-all shadow-sm hover:shadow-md"
            title="Reset"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Sessions Counter */}
        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm mb-12">
          <span>Sessions Completed</span>
          <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-[10px] ml-1">{sessions}</span>
        </div>

        <button 
          onClick={onExit} 
          className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors py-2 px-6 rounded-xl hover:bg-red-50"
        >
          Exit Focus Mode
        </button>
      </div>
    </div>
  );
}

export default FocusMode;