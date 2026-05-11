import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { logTimeSpent } from '../lib/progressStore';

interface StudyTimerProps {
  topicId?: string;
  onClose: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ topicId, onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const lastLoggedRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Log time periodically and on cleanup
  useEffect(() => {
    const diff = seconds - lastLoggedRef.current;
    if (diff >= 30 && topicId) { // Log every 30 seconds
      logTimeSpent(topicId, diff);
      lastLoggedRef.current = seconds;
    }
  }, [seconds, topicId]);

  const handleClose = () => {
    if (topicId && seconds > lastLoggedRef.current) {
      logTimeSpent(topicId, seconds - lastLoggedRef.current);
    }
    onClose();
  };

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] glass border-white/10 p-6 rounded-[2rem] shadow-2xl flex items-center gap-6"
    >
      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
        <Timer className={`w-6 h-6 text-orange-500 ${isActive ? 'animate-pulse' : ''}`} />
      </div>
      
      <div>
        <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Focus Timer</p>
        <p className="text-3xl font-mono font-bold text-white tabular-nums tracking-tighter">
          {formatTime(seconds)}
        </p>
      </div>

      <div className="flex items-center gap-2 pl-4 border-l border-white/5">
        <button
          onClick={toggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white/10 text-white' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'}`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/5 text-white/30 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
