import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Sparkles, Loader2, X, CheckCircle2, AlertCircle, Timer, Award } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SubjectModule, Question } from '../types';
import { saveQuizScore, unlockBadge } from '../lib/progressStore';

interface MockExamProps {
  subject: SubjectModule;
  onClose: () => void;
}

export const MockExam: React.FC<MockExamProps> = ({ subject, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<'intro' | 'exam' | 'results'>('intro');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<{ score: number; total: number } | null>(null);

  const generateExam = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const chapters = [...subject.class11, ...subject.class12];
      const chaptersList = chapters.map(c => c.title).join(', ');

      const prompt = `You are a professional board examiner for ${subject.name}. 
      Generate 10 high-quality multiple choice questions covering the following chapters: ${chaptersList}.
      
      Return ONLY a JSON array:
      [
        {
          "id": "q1",
          "question": "...",
          "options": ["...", "...", "...", "..."],
          "correctAnswer": 0
        }
      ]`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "[]";
      const jsonStr = text.includes('[') ? text.substring(text.indexOf('['), text.lastIndexOf(']') + 1) : "[]";
      const parsed = JSON.parse(jsonStr) as Question[];
      
      setQuestions(parsed);
      setCurrentStep('exam');
    } catch (err) {
      console.error("Exam generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (qId: string, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const submitExam = () => {
    let score = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
    });
    
    setResults({ score, total: questions.length });
    setCurrentStep('results');
    
    // Save as mock exam result (can reuse quiz logic or separate)
    saveQuizScore(`mock_${subject.id}`, score, questions.length);

    if (score === questions.length) {
      unlockBadge({
        id: 'exam_ace',
        name: 'Exam Ace',
        description: `Perfect score on ${subject.name} mock exam!`,
        icon: 'trophy'
      });
    } else if (score >= questions.length * 0.8) {
      unlockBadge({
        id: 'scholarly',
        name: 'Scholarly',
        description: `Passed ${subject.name} mock exam with high honors.`,
        icon: 'star'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
    >
      <div className="w-full max-w-4xl bg-[#0a0a0b] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <FileText className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-500/60 mb-1">Full Curriculum Challenge</p>
              <h3 className="text-3xl font-serif font-bold text-white">Mock Examination</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10">
            <X className="w-6 h-6 text-white/50" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {currentStep === 'intro' ? (
            <div className="max-w-md mx-auto py-12 text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-8">
                 <Sparkles className="w-12 h-12 text-orange-500" />
              </div>
              <h4 className="text-2xl font-serif font-bold mb-4">Are you exam-ready?</h4>
              <p className="text-white/40 mb-10 leading-relaxed">This mock exam simulates the actual board format. We'll generate 10 unique questions covering your entire curriculum.</p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                  <Timer className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-white font-bold text-sm">Suggested Time</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase">15 Minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                  <Award className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-white font-bold text-sm">Earn Recognition</p>
                    <p className="text-white/40 text-[10px] font-bold uppercase">Unlock Specialized Badges</p>
                  </div>
                </div>
              </div>

              <button
                onClick={generateExam}
                disabled={loading}
                className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-orange-500/20 transform hover:scale-105 transition-all text-lg flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                {loading ? "Generating Paper..." : "Start Full Mock Exam"}
              </button>
            </div>
          ) : currentStep === 'exam' ? (
            <div className="space-y-12">
               {questions.map((q, idx) => (
                 <div key={q.id} className="p-8 glass border-white/5 rounded-[2.5rem]">
                   <p className="text-orange-500 font-bold mb-6 text-sm uppercase tracking-widest">Question {idx + 1}</p>
                   <h5 className="text-xl font-serif font-bold text-white mb-8">{q.question}</h5>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {q.options.map((opt, optIdx) => (
                       <button
                         key={optIdx}
                         onClick={() => handleAnswerSelect(q.id, optIdx)}
                         className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden group ${userAnswers[q.id] === optIdx ? 'bg-orange-500 border-orange-500 text-white' : 'glass border-white/5 text-white/60 hover:bg-white/5 hover:border-white/10'}`}
                       >
                         <span className="relative z-10 font-medium">{opt}</span>
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
               
               <div className="flex justify-center pt-8">
                 <button
                   onClick={submitExam}
                   disabled={Object.keys(userAnswers).length < questions.length}
                   className={`px-12 py-5 rounded-[2rem] font-bold text-lg transition-all ${Object.keys(userAnswers).length < questions.length ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20'}`}
                 >
                   Submit Examination
                 </button>
               </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-32 h-32 rounded-[3.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                 <Award className="w-16 h-16 text-emerald-500" />
              </div>
              <h4 className="text-4xl font-serif font-bold mb-4">Results are in</h4>
              <p className="text-white/40 mb-12">You scored {results?.score} out of {results?.total}</p>
              
              <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                 <button
                   onClick={onClose}
                   className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-bold border border-white/10 transition-all"
                 >
                   Close Session
                 </button>
                 <button
                   onClick={() => { setCurrentStep('intro'); setUserAnswers({}); }}
                   className="flex-1 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-orange-500/20 transition-all"
                 >
                   Try Again
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
