import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  X, 
  Film, 
  Sparkles, 
  Clapperboard, 
  Headphones, 
  Layout, 
  Maximize2,
  Volume2,
  Settings,
  CirclePlay,
  Loader2,
  Eye
} from 'lucide-react';
import { getVeoVideoPrompt } from '../services/geminiService';

interface VeoVideoMasterclassProps {
  topicTitle: string;
  topicContent: string;
  onClose: () => void;
}

interface VeoData {
  veoPrompt: string;
  script: string;
  style: string;
}

export const VeoVideoMasterclass: React.FC<VeoVideoMasterclassProps> = ({ topicTitle, topicContent, onClose }) => {
  const [data, setData] = useState<VeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getVeoVideoPrompt(topicTitle, topicContent);
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [topicTitle, topicContent]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
    >
      <div className="w-full max-w-6xl aspect-video bg-[#050505] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative group">
        
        {/* Cinematic Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-30 opacity-0 group-hover:opacity-100 transition-all duration-700">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                 <Clapperboard className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-0.5">Veo Masterclass Series</p>
                 <h3 className="text-xl font-serif font-bold text-white italic">{topicTitle}</h3>
              </div>
           </div>
           <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all"
           >
            <X className="w-6 h-6 text-white/50" />
           </button>
        </div>

        {/* Video Canvas (The "Veo" Experience) */}
        <div className="flex-1 relative flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-6" />
              <h4 className="text-2xl font-serif font-bold text-white italic">Rendering Cinematic Vision...</h4>
              <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] mt-4">AI Video Logic Engine is Active</p>
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
               {/* Concept Keyframe Visualization (Placeholder/Generated Effect) */}
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5" />
               <motion.div 
                 initial={{ scale: 1.1, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ duration: 1.5 }}
                 className="relative z-10 text-center max-w-3xl p-12"
               >
                  <div className="mb-10 w-24 h-24 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto shadow-2xl relative">
                     <Sparkles className="w-10 h-10 text-orange-500" />
                     <div className="absolute inset-0 rounded-[2.5rem] bg-orange-500/20 animate-ping opacity-20" />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-white italic tracking-tighter leading-none">
                      {topicTitle}
                    </h2>
                    <div className="flex items-center justify-center gap-4 text-white/40">
                       <span className="text-[10px] uppercase font-bold tracking-[0.5em] border-l border-white/20 pl-4">Digital Twin</span>
                       <span className="text-[10px] uppercase font-bold tracking-[0.5em] border-l border-white/20 pl-4">4K Simulation</span>
                    </div>
                  </div>

                  {/* AI Director's Script */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-16 p-8 glass border-orange-500/20 rounded-[2.5rem] bg-orange-500/5 max-w-2xl mx-auto"
                      >
                         <div className="flex items-center gap-2 mb-4 justify-center">
                            <Headphones className="w-4 h-4 text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Narration Script</span>
                         </div>
                         <p className="text-xl md:text-2xl font-serif text-white leading-relaxed italic">
                            "{data?.script}"
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isPlaying && progress === 0 && (
                    <motion.button 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={() => setIsPlaying(true)}
                      className="mt-16 w-24 h-24 rounded-full bg-white flex items-center justify-center group/play overflow-hidden shadow-2xl"
                    >
                       <CirclePlay className="w-12 h-12 text-black group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  )}
               </motion.div>

               {/* Vision Description Overlay (Bottom Left) */}
               <div className="absolute bottom-12 left-12 max-w-sm z-30 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Video Meta-Data</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed italic uppercase tracking-tighter line-clamp-3">
                    {data?.veoPrompt}
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Cinematic Controls Bar */}
        <div className="p-8 border-t border-white/5 bg-black z-30">
           <div className="w-full h-1 bg-white/5 rounded-full mb-8 relative overflow-hidden group/bar">
              <motion.div 
                animate={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-full bg-orange-500 shadow-[0_0_15px_rgba(242,125,38,0.5)]"
              />
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                 <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                 >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                 </button>
                 <div className="flex items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white">00:{Math.floor(progress * 0.15).toString().padStart(2, '0')}</span>
                    <span>/</span>
                    <span>00:15</span>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                    <Volume2 className="w-4 h-4" /> 75%
                 </button>
                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" /> 4K Ultra
                 </button>
                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg bg-white/5">
                    <Maximize2 className="w-4 h-4" /> Cinema
                 </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
