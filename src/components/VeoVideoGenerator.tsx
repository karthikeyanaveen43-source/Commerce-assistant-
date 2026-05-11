import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Play, 
  Sparkles, 
  Loader2, 
  X, 
  Volume2, 
  Cpu, 
  Layers,
  Wand2
} from 'lucide-react';
import { getVeoVideoPrompt } from '../services/geminiService';

interface VeoVideoGeneratorProps {
  topicTitle: string;
  topicContent: string;
  onClose: () => void;
}

export const VeoVideoGenerator: React.FC<VeoVideoGeneratorProps> = ({ topicTitle, topicContent, onClose }) => {
  const [data, setData] = useState<{ veoPrompt: string, script: string, style: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'scripting' | 'generating' | 'ready'>('idle');

  React.useEffect(() => {
    const startGeneration = async () => {
      setStatus('scripting');
      const result = await getVeoVideoPrompt(topicTitle, topicContent);
      if (result) {
        setData(result);
        setStatus('generating');
        // Simulate video generation time
        setTimeout(() => {
          setStatus('ready');
        }, 5000);
      } else {
        setStatus('idle');
      }
    };
    startGeneration();
  }, [topicTitle, topicContent]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl glass-card rounded-[3rem] overflow-hidden flex flex-col md:flex-row min-h-[500px]"
      >
        {/* Visual Panel */}
        <div className="md:w-3/5 bg-black relative flex items-center justify-center overflow-hidden border-r border-white/10">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-12"
              >
                <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4">Veo Video Generator</h3>
                <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
                  Generate a high-fidelity AI explainer video for this topic using Google's Veo model.
                </p>
                <button 
                  onClick={startGeneration}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-2xl transition-all flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-5 h-5" /> Generate with Veo
                </button>
              </motion.div>
            )}

            {(status === 'scripting' || status === 'generating') && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6 mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <h4 className="text-xl font-bold font-serif mb-2">
                  {status === 'scripting' ? 'Analyzing Topic Context...' : 'Rendering with Veo Engine...'}
                </h4>
                <div className="flex gap-1 justify-center">
                  <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}

            {status === 'ready' && (
              <motion.div 
                key="ready"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="w-full h-full relative"
              >
                {/* Simulated high-quality AI video background */}
                <video 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover opacity-60"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-floating-golden-coins-in-the-air-40342-large.mp4" type="video/mp4" />
                </video>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="px-3 py-1 bg-orange-500 rounded text-[10px] font-bold uppercase tracking-widest text-white">VEORENDER v1.0</div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{topicTitle}</h3>
                  <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all">
                      <Play className="w-6 h-6 fill-black" />
                    </button>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="h-full bg-white"
                      />
                    </div>
                    <Volume2 className="w-5 h-5 text-white/50" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Panel */}
        <div className="md:w-2/5 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2 text-orange-500">
               <Sparkles className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AI Synthesis</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                 <Wand2 className="w-3 h-3" /> Veo Generation Prompt
              </h4>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white/60 leading-relaxed italic">
                 {data?.veoPrompt || "Pending prompt engineering..."}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                 <Layers className="w-3 h-3" /> Audio Script
              </h4>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-white/80 leading-relaxed">
                 {data?.script || "Analyzing topic to generate tailored narration script..."}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <p className="text-[10px] text-white/30 uppercase font-bold">Model</p>
                 <p className="text-xs font-mono">Veo Beta-2</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] text-white/30 uppercase font-bold">Resolution</p>
                 <p className="text-xs font-mono">4K Cinematic</p>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-[10px] text-white/20 leading-relaxed">
              Veo is a experimental video model. This output is a high-fidelity prototype demonstrating how AI explainer videos are requested and rendered within TradeWise.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
