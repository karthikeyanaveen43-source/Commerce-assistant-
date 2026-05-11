import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, X, Loader2, BookOpen } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Chapter } from '../types';

interface ChapterSummaryProps {
  chapter: Chapter;
  onClose: () => void;
}

export const ChapterSummary: React.FC<ChapterSummaryProps> = ({ chapter, onClose }) => {
  const [summary, setSummary] = useState<string | null>(chapter.summary || null);
  const [loading, setLoading] = useState(!chapter.summary);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!summary) {
      generateSummary();
    }
  }, [chapter.id]);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert academic assistant. Generate a concise, high-impact summary of the following chapter titled "${chapter.title}". 
      
      Chapter Description: ${chapter.description}
      
      Key Topics Included:
      ${chapter.topics.map(t => `- ${t.title}: ${t.description}`).join('\n')}
      
      The summary should:
      1. Be structured with "Core Objectives" and "Key Takeaways".
      2. Be around 150-200 words.
      3. Use clear, encouraging language for a high school student.
      4. Highlight why this chapter is important in the context of the subject.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setSummary(response.text || "Unable to generate summary at this time.");
    } catch (err) {
      console.error("Summary generation error:", err);
      setError("Failed to generate AI summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <header className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-orange-500/60 mb-1">AI Chapter Insights</p>
              <h3 className="text-2xl font-serif font-bold text-white">{chapter.title}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
              <p className="text-white/40 animate-pulse font-medium">Synthesizing chapter concepts with AI...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-500/5 border border-red-500/20 rounded-3xl">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={generateSummary}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors"
              >
                Retry Generation
              </button>
            </div>
          ) : (
            <div className="space-y-8 text-left">
              <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/10 items-start">
                 <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <BrainCircuit className="w-5 h-5 text-blue-400" />
                 </div>
                 <div>
                   <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Subject Connection</h4>
                   <p className="text-white/60 text-sm leading-relaxed italic">
                     This chapter provides the foundational logic for {chapter.title.toLowerCase()}, essential for mastering following units.
                   </p>
                 </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-white/80 leading-relaxed text-lg">
                  {summary}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  <BookOpen className="w-3 h-3" /> {chapter.topics.length} Key Topics
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
                >
                  Start Learning
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
