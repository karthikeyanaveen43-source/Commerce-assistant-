import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Loader2, BookOpen, Brain, GraduationCap, Quote, TrendingUp, Volume2, Square, Headphones } from 'lucide-react';
import Markdown from 'react-markdown';
import { getTeacherExplanation } from '../services/geminiService';
import { useSpeech } from '../hooks/useSpeech';

interface AITeacherProps {
  subjectName: string;
  topicTitle: string;
  topicContent: string;
  onClose: () => void;
}

export const AITeacher: React.FC<AITeacherProps> = ({ subjectName, topicTitle, topicContent, onClose }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stopSpeaking } = useSpeech();

  useEffect(() => {
    const fetchExplanation = async () => {
      const text = await getTeacherExplanation(subjectName, topicTitle, topicContent);
      setExplanation(text);
      setLoading(false);
    };
    fetchExplanation();
    return () => stopSpeaking();
  }, [subjectName, topicTitle, topicContent]);

  const handleToggleLecture = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (explanation) {
      // Strip markdown for better speech
      const plainText = explanation.replace(/[#*`]/g, '');
      speak(`Welcome students. Let's begin our lecture on ${topicTitle}. ${plainText}`);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6"
    >
      <div className="w-full max-w-5xl bg-[#0a0a0b] border border-white/10 rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <GraduationCap className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-orange-500 mb-1">AI Professor Wisey</p>
              <h3 className="text-3xl font-serif font-bold text-white italic">The Masterclass</h3>
            </div>
          </div>
          <div className="flex items-center gap-4 py-2">
            {!loading && (
              <button 
                onClick={handleToggleLecture}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold uppercase transition-all tracking-[0.2em] text-xs ${isSpeaking ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'bg-orange-500 text-white shadow-lg hover:scale-105 active:scale-95'}`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-4 h-4 fill-current" /> Stop Lecture
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4" /> Listen to Masterclass
                  </>
                )}
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
            >
              <X className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="py-32 text-center">
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
                <h4 className="text-2xl font-serif font-bold mb-4">Preparing the Lecture...</h4>
                <p className="text-white/40 animate-pulse">Our AI teacher is drafting a pedagogical walkthrough for {topicTitle}.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex items-center gap-4 p-6 bg-orange-500/5 border border-orange-500/20 rounded-[2rem]">
                  <Quote className="w-6 h-6 text-orange-500 shrink-0" />
                  <p className="text-white/70 italic text-lg leading-relaxed">
                    "Welcome students. Today, we're going to demystify {topicTitle} and see how it actually shapes the commerce world."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="p-6 glass border-white/5 rounded-3xl bg-blue-500/5">
                     <Brain className="w-5 h-5 text-blue-500 mb-4" />
                     <h5 className="font-bold text-white text-sm">Targeted Concept</h5>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Foundational Theory</p>
                   </div>
                   <div className="p-6 glass border-white/5 rounded-3xl bg-orange-500/5">
                     <TrendingUp className="w-5 h-5 text-orange-500 mb-4" />
                     <h5 className="font-bold text-white text-sm">Industry Relevance</h5>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Market Application</p>
                   </div>
                   <div className="p-6 glass border-white/5 rounded-3xl bg-emerald-500/5">
                     <BookOpen className="w-5 h-5 text-emerald-500 mb-4" />
                     <h5 className="font-bold text-white text-sm">Exam Focus</h5>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">High Probability</p>
                   </div>
                </div>

                <div className="prose prose-invert prose-orange max-w-none">
                   <div className="markdown-body">
                      <Markdown>{explanation || ""}</Markdown>
                   </div>
                </div>

                <div className="p-12 glass-card rounded-[3rem] text-center border-orange-500/20">
                   <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-6" />
                   <h4 className="text-2xl font-serif font-bold mb-4 italic">Class Dismissed</h4>
                   <p className="text-white/50 mb-10 max-w-lg mx-auto">
                     I hope this lecture gave you a clearer perspective on {topicTitle}. 
                     Keep practicing and remember—commerce is about more than just numbers; it's about logic. 
                   </p>
                   <button 
                     onClick={onClose}
                     className="px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black uppercase tracking-widest shadow-2xl shadow-orange-500/30 transition-all active:scale-95"
                   >
                     End Masterclass
                   </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
