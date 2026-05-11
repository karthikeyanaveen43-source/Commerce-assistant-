import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Question } from '../types';
import { GoogleGenAI } from "@google/genai";

interface QuizProps {
  topicTitle: string;
  topicContent: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ topicTitle, topicContent, onComplete, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate 5 challenging multiple-choice questions for the topic: "${topicTitle}".
      Context content: ${topicContent.substring(0, 2000)}
      
      Format the response exactly as a JSON array:
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
    } catch (err) {
      console.error("Quiz generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestions();
  }, [topicTitle]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-8" />
        <h4 className="text-2xl font-serif font-bold mb-4">Generating Custom Quiz...</h4>
        <p className="text-white/40 animate-pulse">Our AI is crafting unique questions to test your mastery of {topicTitle}.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score);
    }
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-6 glow">
          <Trophy className="w-10 h-10 text-orange-500" />
        </div>
        <h3 className="text-3xl font-serif font-bold mb-2">Quiz Completed!</h3>
        <p className="text-white/50 mb-4">You scored {score} out of {questions.length}</p>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold uppercase tracking-widest mb-8">
          <CheckCircle2 className="w-4 h-4" /> Score Saved Successfully
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 glass hover:bg-white/5 rounded-full font-bold transition-all"
          >
            Close
          </button>
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setScore(0);
              setShowResult(false);
              generateQuestions();
            }}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <RefreshCw className="w-4 h-4" /> Generate New Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="p-8 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-white/30">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-serif font-bold mb-8">{currentQuestion.question}</h3>

      <div className="space-y-3 mb-10">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswer;
          const isSelected = index === selectedOption;
          
          let statusStyles = "bg-white/5 border-white/10 hover:border-white/30";
          if (isAnswered) {
            if (isCorrect) statusStyles = "bg-green-500/10 border-green-500/30 text-green-500";
            else if (isSelected) statusStyles = "bg-red-500/10 border-red-500/30 text-red-500";
            else statusStyles = "opacity-30 border-white/5";
          } else if (isSelected) {
            statusStyles = "bg-orange-500/10 border-orange-500/50 text-orange-500";
          }

          return (
            <button
              key={index}
              disabled={isAnswered}
              onClick={() => handleOptionClick(index)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${statusStyles}`}
            >
              <span className="font-medium">{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        {!isAnswered ? (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmit}
            className="px-10 py-3 bg-orange-500 disabled:opacity-30 hover:bg-orange-600 rounded-full font-bold transition-all ml-auto"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-10 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all ml-auto flex items-center gap-2"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
