import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, RefreshCcw, ChevronLeft, ChevronRight, X, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardsProps {
  topicTitle: string;
  topicContent: string;
  onClose: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ topicTitle, topicContent, onClose }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateFlashcards();
  }, [topicTitle]);

  const generateFlashcards = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert educator. Create 5 clear and effective flashcards for the topic "${topicTitle}". 
      Based on this content: ${topicContent.substring(0, 2000)}
      
      Return ONLY a JSON array of objects with "question" and "answer" properties. 
      Format example: [{"question": "...", "answer": "..."}]`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "[]";
      // Basic extraction if the model wraps in markdown
      const jsonStr = text.includes('[') ? text.substring(text.indexOf('['), text.lastIndexOf(']') + 1) : "[]";
      const parsed = JSON.parse(jsonStr);
      setCards(parsed);
    } catch (err) {
       console.error("Flashcards generation error:", err);
       setError("Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        <header className="w-full flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-orange-500/60 mb-1">AI Flashcards</p>
              <h3 className="text-2xl font-serif font-bold text-white">{topicTitle}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white/50" />
          </button>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-[3rem] w-full">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
            <p className="text-white/40 animate-pulse font-medium">Generating intelligent flashcards...</p>
          </div>
        ) : error ? (
           <div className="h-96 flex flex-col items-center justify-center text-center p-12 bg-red-500/5 border border-red-500/10 rounded-[3rem] w-full">
             <p className="text-red-400 mb-8">{error}</p>
             <button onClick={generateFlashcards} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-all">Retry</button>
           </div>
        ) : cards.length > 0 ? (
          <div className="w-full space-y-12">
            <div 
              className="relative w-full h-80 perspective-1000 cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
                className="w-full h-full relative preserve-3d"
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white/[0.03] border border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center group-hover:bg-white/[0.05] transition-colors">
                  <div className="absolute top-8 left-8 p-3 rounded-xl bg-orange-500/10 text-orange-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em] mb-4">Question</p>
                  <h4 className="text-2xl font-serif font-bold text-white leading-relaxed">
                    {cards[currentIndex].question}
                  </h4>
                  <p className="mt-12 text-xs font-bold text-orange-500/60 uppercase tracking-widest animate-pulse">Click to Reveal Answer</p>
                </div>

                {/* Back */}
                <div 
                  className="absolute inset-0 backface-hidden bg-orange-500/10 border border-orange-500/30 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center rotate-y-180"
                >
                  <p className="text-[10px] uppercase font-bold text-orange-500/60 tracking-[0.2em] mb-4">Answer</p>
                  <p className="text-xl text-white leading-relaxed">
                    {cards[currentIndex].answer}
                  </p>
                  <p className="mt-12 text-xs font-bold text-orange-500 uppercase tracking-widest">Click to Flip Back</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between">
              <button 
                onClick={prevCard}
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/50 hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  {cards.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/10'}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em]">
                  Card {currentIndex + 1} of {cards.length}
                </p>
              </div>

              <button 
                onClick={nextCard}
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/50 hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};
