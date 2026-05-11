import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Loader2, BookOpen, Brain, ListChecks } from 'lucide-react';
import Markdown from 'react-markdown';
import { getChapterRecap } from '../services/geminiService';

interface ChapterRecapModalProps {
  chapterTitle: string;
  topicTitles: string[];
  onClose: () => void;
}

export const ChapterRecapModal: React.FC<ChapterRecapModalProps> = ({ chapterTitle, topicTitles, onClose }) => {
  const [recap, setRecap] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecap = async () => {
      const text = await getChapterRecap(chapterTitle, topicTitles.join(', '));
      setRecap(text);
      setLoading(false);
    };
    fetchRecap();
  }, [chapterTitle, topicTitles]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[450] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
    >
      <div className="w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-[3.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <header className="p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-orange-500 mb-0.5">Chapter Analytics</p>
              <h3 className="text-2xl font-serif font-bold text-white italic">{chapterTitle}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 md:p-12 custom-scrollbar">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-6" />
              <h4 className="text-xl font-serif font-bold text-white mb-2">Analyzing Chapter Synergy...</h4>
              <p className="text-white/30 italic">Connecting {topicTitles.length} key concepts for you.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 glass border-white/5 rounded-2xl bg-white/[0.02]">
                    <Brain className="w-4 h-4 text-blue-500 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-white/30">Difficulty</p>
                    <p className="text-xs font-bold text-white uppercase mt-1">Balanced</p>
                 </div>
                 <div className="p-4 glass border-white/5 rounded-2xl bg-white/[0.02]">
                    <Sparkles className="w-4 h-4 text-orange-500 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-white/30">AI Insights</p>
                    <p className="text-xs font-bold text-white uppercase mt-1">Extracted</p>
                 </div>
                 <div className="p-4 glass border-white/5 rounded-2xl bg-white/[0.02]">
                    <ListChecks className="w-4 h-4 text-emerald-500 mb-2" />
                    <p className="text-[10px] uppercase font-bold text-white/30">Readiness</p>
                    <p className="text-xs font-bold text-white uppercase mt-1">High Scope</p>
                 </div>
              </div>

              <div className="prose prose-invert prose-orange max-w-none">
                 <div className="markdown-body">
                    <Markdown>{recap || ""}</Markdown>
                 </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-widest hover:glow transition-all active:scale-95"
              >
                Continue Learning
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
