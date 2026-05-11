import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Sparkles, Loader2, CheckCircle2, Clock, X, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SubjectModule, StudyPlan } from '../types';
import { saveStudyPlan } from '../lib/progressStore';

interface StudyPlanGeneratorProps {
  subject: SubjectModule;
  onClose: () => void;
}

export const StudyPlanGenerator: React.FC<StudyPlanGeneratorProps> = ({ subject, onClose }) => {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chapters = [...subject.class11, ...subject.class12];
      const chaptersSummary = chapters.map(c => `- ${c.title}: ${c.topics.length} topics`).join('\n');

      const prompt = `You are an elite academic personal coach. Create a ${days}-day intensive study plan for the subject "${subject.name}".
      Chapters available:
      ${chaptersSummary}

      Format the response exactly as a JSON object:
      {
        "subjectId": "${subject.id}",
        "generateDate": "${new Date().toISOString()}",
        "days": [
          {
            "day": 1,
            "topics": [
              { "chapterTitle": "...", "topicTitle": "...", "action": "Watch VEO / Read notes" }
            ]
          }
        ]
      }
      Focus on covering key concepts efficiently. Spread the workload across ${days} days.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "{}";
      const jsonStr = text.includes('{') ? text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1) : "{}";
      const parsed = JSON.parse(jsonStr) as StudyPlan;
      
      setPlan(parsed);
      saveStudyPlan(subject.id, parsed);
    } catch (err) {
      console.error("Study plan generation error:", err);
      setError("Failed to create study plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
    >
      <div className="w-full max-w-4xl bg-[#0a0a0b] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-500/60 mb-1">Personalized Strategy</p>
              <h3 className="text-3xl font-serif font-bold text-white">AI Study Plan</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
          >
            <X className="w-6 h-6 text-white/50" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {!plan && !loading ? (
            <div className="max-w-md mx-auto py-12 text-center">
              <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-6" />
              <h4 className="text-2xl font-serif font-bold mb-4">How many days do you have?</h4>
              <p className="text-white/40 mb-10">We'll craft an optimized schedule to cover the entire curriculum within your timeframe.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[3, 7, 14, 30].map(d => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`p-6 rounded-[2rem] border transition-all ${days === d ? 'bg-orange-500 border-orange-500 text-white' : 'glass border-white/5 text-white/50 hover:bg-white/5'}`}
                  >
                    <p className="text-3xl font-bold mb-1">{d}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold">Days</p>
                  </button>
                ))}
              </div>

              <button
                onClick={generatePlan}
                className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-orange-500/20 transform hover:scale-105 transition-all text-lg"
              >
                Generate My Plan
              </button>
            </div>
          ) : loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
              <h4 className="text-2xl font-serif font-bold mb-4">Analyzing Curriculum...</h4>
              <p className="text-white/40 animate-pulse">Our AI is weighting chapters by complexity and optimizing your study path.</p>
            </div>
          ) : plan ? (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between p-10 glass rounded-[3rem] border-orange-500/10 shadow-2xl bg-orange-500/[0.02] gap-6">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center relative">
                    <CheckCircle2 className="w-10 h-10 text-orange-500" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-4 border-[#0a0a0b] animate-pulse" />
                  </div>
                  <div className="text-left">
                    <h5 className="font-serif font-bold text-white text-3xl mb-1 italic">Roadmap Generated</h5>
                    <p className="text-white/40 text-sm tracking-wide">A tailored {days}-day learning journey for {subject.name}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => window.print()}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest"
                  >
                    Export PDF
                  </button>
                  <button 
                    onClick={() => setPlan(null)}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl text-xs font-bold transition-all shadow-xl shadow-orange-500/20 uppercase tracking-widest text-white"
                  >
                    New Plan
                  </button>
                </div>
              </div>

              <div className="relative pl-12 md:pl-20 py-8 space-y-16">
                {/* Timeline Line */}
                <div className="absolute left-6 md:left-[2.75rem] top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-orange-500/10 to-transparent" />

                {plan.days.map((dayPlan) => (
                  <motion.div 
                    key={dayPlan.day}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Timeline Node */}
                    <div className="absolute -left-12 md:-left-20 top-0 w-12 md:w-20 h-20 flex items-center justify-center">
                       <div className="w-10 h-10 rounded-full bg-[#0a0a0b] border-2 border-orange-500/30 flex items-center justify-center z-10 box-glow shadow-orange-500/20">
                          <span className="text-xs font-black text-orange-500">D{dayPlan.day}</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                       <div className="lg:col-span-3 text-left">
                          <h6 className="text-[10px] uppercase tracking-[0.4em] font-black text-orange-500 mb-2">Phase {Math.ceil(dayPlan.day / 3)}</h6>
                          <h4 className="text-2xl font-serif font-bold text-white mb-2 italic">Day {dayPlan.day}</h4>
                          <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Focus Session</p>
                       </div>

                       <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dayPlan.topics.map((t, i) => (
                            <div key={i} className="p-6 glass border-white/5 rounded-[2rem] hover:border-orange-500/20 transition-all group/card bg-white/[0.01] hover:bg-orange-500/[0.02]">
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] text-orange-500/60 font-bold uppercase tracking-widest">{t.chapterTitle}</span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <Sparkles className="w-4 h-4 text-orange-500" />
                                </div>
                              </div>
                              <p className="text-white font-bold text-lg mb-4 leading-tight group-hover/card:text-orange-500 transition-colors">{t.topicTitle}</p>
                              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-[10px] text-white/50 font-bold uppercase tracking-widest">
                                <ChevronRight className="w-3 h-3 text-orange-500" />
                                {t.action}
                              </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : error && (
            <div className="py-24 text-center">
              <p className="text-red-400 mb-8">{error}</p>
              <button onClick={() => setPlan(null)} className="px-8 py-3 bg-white/10 rounded-full font-bold">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
