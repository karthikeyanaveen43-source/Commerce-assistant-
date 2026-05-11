import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioNarrationProps {
  text: string;
  title: string;
}

export const AudioNarration: React.FC<AudioNarrationProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    
    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const togglePlay = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      synth.cancel();
      if (utterance) {
        synth.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
        {isPlaying && !isPaused ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Volume2 className="w-5 h-5 text-orange-500" />
          </motion.div>
        ) : (
          <VolumeX className="w-5 h-5 text-white/30" />
        )}
      </div>
      
      <div className="flex-grow">
        <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Narration Mode</p>
        <p className="text-xs font-semibold text-white/70 truncate max-w-[150px]">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
        >
          {isPlaying && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        
        <AnimatePresence>
          {isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={stop}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
