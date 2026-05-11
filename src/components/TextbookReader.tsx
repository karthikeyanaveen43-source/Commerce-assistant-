import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Sparkles, 
  Highlighter, 
  MessageSquare, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Type,
  RotateCcw,
  WifiOff
} from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { useOffline } from '../hooks/useOffline';

interface TextbookReaderProps {
  topicTitle: string;
  content: string;
  onClose: () => void;
}

export const TextbookReader: React.FC<TextbookReaderProps> = ({ topicTitle, content, onClose }) => {
  const [selectedText, setSelectedText] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const isOffline = useOffline();
  const readerRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 5) {
      setSelectedText(text);
    }
  };

  const explainSelection = async () => {
    if (!selectedText) return;
    setIsLoading(true);
    const response = await getGeminiResponse(
      `Explain this specific concept from my textbook in simple terms: "${selectedText}"`,
      `The student is reading a textbook chapter titled "${topicTitle}". The full context of the page is: ${content.substring(0, 500)}...`
    );
    setExplanation(response);
    setIsLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex bg-[#050505] text-white"
    >
      {/* Left Pane: The Textbook */}
      <div className="flex-1 flex flex-col h-full border-r border-white/10 relative">
        {/* Toolbar */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Textbook Mode</p>
              <h2 className="text-xl font-serif font-bold">{topicTitle}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
              <Type className="w-3 h-3 text-white/40" />
              <input 
                type="range" 
                min="14" 
                max="24" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-20 accent-orange-500"
              />
            </div>
            <div className="px-4 py-2 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Highlighter className="w-3 h-3" /> Select text to explain
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div 
          ref={readerRef}
          onMouseUp={handleTextSelection}
          className="flex-1 overflow-y-auto p-12 md:p-24 max-w-4xl mx-auto custom-scrollbar"
        >
          <div 
            style={{ fontSize: `${fontSize}px` }}
            className="prose prose-invert max-w-none leading-relaxed text-white/80 font-serif selection:bg-orange-500/30"
          >
            {/* Textbook Body - Splitting into paragraphs for better reading feel */}
            {content.split('\n').map((para, i) => (
              <p key={i} className="mb-8">{para}</p>
            ))}
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/10 text-center opacity-30 text-[10px] uppercase tracking-[0.3em]">
            TradeWise Digital Academic Library — CBSE Grade 11/12
          </div>
        </div>

        {/* Highlight Action Bubble */}
        <AnimatePresence>
          {selectedText && !explanation && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={explainSelection}
              disabled={isOffline}
              className={`fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 active:scale-95 transition-all z-20 ${isOffline ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              {isOffline ? "Connect to Internet for Analysis" : "Explain Selection"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right Pane: Wisey AI Mentor Sidebar */}
      <div className="w-full md:w-[450px] bg-white/5 backdrop-blur-2xl flex flex-col h-full border-l border-white/10 overflow-hidden">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-500" />
             </div>
             <div>
               <h3 className="font-serif font-bold text-lg">Wisey Analysis</h3>
               <p className="text-[10px] uppercase tracking-widest text-white/40">AI Reading Assistant</p>
             </div>
          </div>
          <button onClick={() => setExplanation(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <RotateCcw className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           <AnimatePresence mode="wait">
             {isLoading ? (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-full flex flex-col items-center justify-center text-center space-y-4"
               >
                 <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                 <p className="text-sm text-white/40 italic">Wisey is deciphering the textbook jargon for you...</p>
               </motion.div>
             ) : explanation ? (
               <motion.div 
                 key="explanation"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-6"
               >
                 <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-orange-500 mb-2">Analyzing excerpt:</p>
                    <p className="text-xs text-white/60 italic leading-relaxed">"{selectedText}"</p>
                 </div>
                 
                 <div className="space-y-4 text-white/90 leading-relaxed text-sm md:text-base">
                    {explanation.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                 </div>
                 
                 <div className="pt-8">
                   <button 
                     onClick={() => {
                       setSelectedText('');
                       setExplanation(null);
                     }}
                     className="w-full py-4 glass border-white/10 hover:bg-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all"
                   >
                     Clear Analysis & Keep Reading
                   </button>
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full flex flex-col items-center justify-center text-center opacity-40 px-12"
               >
                 <MessageSquare className="w-12 h-12 mb-6 text-white/20" />
                 <h4 className="text-xl font-serif font-bold mb-2">Real-time Explanations</h4>
                 <p className="text-xs leading-relaxed">
                   Highlight any sentence or word in the textbook to receive instant, simplified explanations from Wisey AI.
                 </p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="p-8 bg-black/20 border-t border-white/10">
           <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                 <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed italic">
                "I'm here to help you connect the dots as you read. Think of me as your personal tutor looking over your shoulder." — Wisey
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
