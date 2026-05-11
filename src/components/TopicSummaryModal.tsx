import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Loader2, ListChecks, Target, Zap } from 'lucide-react';
import Markdown from 'react-markdown';
import { getTopicSummary } from '../services/geminiService';

interface TopicSummaryModalProps {
  topicTitle: string;
  topicContent: string;
  onClose: () => void;
}

export const TopicSummaryModal: React.FC<TopicSummaryModalProps> = ({ topicTitle, topicContent, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const text = await getTopicSummary(topicTitle, topicContent);
      setSummary(text);
      setLoading(false);
    };
    fetchSummary();
  }, [topicTitle, topicContent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
    >
      <div className="w-full max-w-lg glass-card p-10 rounded-[3rem] relative border-orange-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex items-center gap-4 mb-8 text-left">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Target className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-orange-500 leading-none mb-1">AI Quick Summary</p>
            <h3 className="text-2xl font-serif font-bold text-white italic">{topicTitle}</h3>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
            <p className="text-white/40 italic">Synthesizing must-know points...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-left"
          >
            <div className="prose prose-invert max-w-none">
               <div className="markdown-body text-white/80 leading-relaxed">
                  <Markdown>{summary || ""}</Markdown>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <Zap className="w-4 h-4 text-orange-500 mb-2" />
                <h5 className="text-[10px] uppercase font-bold text-white/40 mb-1">Complexity</h5>
                <p className="text-xs font-bold text-white">Focus Point</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <ListChecks className="w-4 h-4 text-emerald-500 mb-2" />
                <h5 className="text-[10px] uppercase font-bold text-white/40 mb-1">Status</h5>
                <p className="text-xs font-bold text-white italic">Exam Critical</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-5 bg-orange-500 text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all mt-4"
            >
              Ready to Practice
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
