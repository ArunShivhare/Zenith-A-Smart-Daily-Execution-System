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
    <div className="fixed inset-0 bg-[#0F172A] text-white flex flex-col items-center justify-center transition-all duration-700">
      {/* Background Glow Effect */}
      <div className={`absolute w-125 h-125 rounded-full blur-[120px] transition-colors duration-1000 ${isRunning ? "bg-indigo-900/30" : "bg-red-900/20"}`} />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Current Focus</p>
          <h2 className="text-2xl font-bold tracking-tight text-gray-100">{task.title}</h2>
        </div>

        {/* Big Timer Display */}
        <div className="relative flex items-center justify-center mb-12 group">
          <div className="text-[120px] font-black tracking-tighter leading-none select-none tabular-nums">
            {formatTime()}
          </div>
        </div>

        {/* Duration Selectors */}
        <div className="flex gap-3 mb-10 bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {[25, 45, 60].map((min) => (
            <button
              key={min}
              onClick={() => setDuration(min)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${duration === min ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              {min}m
            </button>
          ))}
        </div>

        {/* Main Controls */}
        <div className="flex gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all border border-white/10 active:scale-95"
            >
              Pause
            </button>
          )}

          <button
            onClick={() => { setTime(duration * 60); setIsRunning(false); }}
            className="p-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl transition-all border border-white/5"
            title="Reset"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center gap-4 text-gray-500 mb-12">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Sessions</span>
            <span className="text-xl font-bold text-indigo-400">{sessions}</span>
          </div>
        </div>

        <button 
          onClick={onExit} 
          className="text-gray-500 hover:text-red-400 text-sm font-bold transition-colors py-2 px-4 hover:bg-red-400/10 rounded-xl"
        >
          End Focus Mode
        </button>
      </div>
    </div>
  );
}

export default FocusMode;
