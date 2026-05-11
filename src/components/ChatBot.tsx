import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Loader2, Minimize2, Maximize2, WifiOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { useOffline } from '../hooks/useOffline';
import { useSpeech } from '../hooks/useSpeech';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const ChatBot: React.FC<{ context?: string }> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isAutoSpeak, setIsAutoSpeak] = useState(false);
  const isOffline = useOffline();
  const { speak, listen, isListening, isSupported, stopSpeaking } = useSpeech();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hello! I'm Wisey, your AI Commerce Mentor. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getGeminiResponse(userMessage.content, context);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

    if (isAutoSpeak) {
      speak(response);
    }
  };

  const handleMicClick = () => {
    if (isListening) return;
    listen((text) => {
      setInput(text);
      handleSend(text);
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        id="chatbot-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-orange-500 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all glow z-50 text-white"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-8 h-8" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 'bottom right', originY: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-96 glass-card rounded-[2rem] overflow-hidden z-[51] flex flex-col transition-all duration-300"
          >
            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white">Wisey</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">AI Commerce Mentor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (isAutoSpeak) stopSpeaking();
                    setIsAutoSpeak(!isAutoSpeak);
                  }}
                  className={`p-2 rounded-lg transition-colors ${isAutoSpeak ? 'bg-orange-500/20 text-orange-500' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  title={isAutoSpeak ? "Disable Auto-speak" : "Enable Auto-speak"}
                >
                  {isAutoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {isOffline && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3">
                      <WifiOff className="w-5 h-5 text-orange-500" />
                      <p className="text-xs text-white/60">I'm currently sleeping because there's no internet connection. I'll be back when you're online!</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500'}`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group ${msg.role === 'user' ? 'bg-blue-500/10 border border-blue-500/20 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'}`}>
                        {msg.content}
                        {msg.role === 'bot' && (
                          <button 
                            onClick={() => speak(msg.content)}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-all"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        <p className="text-xs text-white/40 italic">Wisey is thinking...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/5 border-t border-white/10">
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        disabled={isOffline}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isOffline ? "Connect to the internet to talk..." : "Ask Wisey about Commerce..."}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-white/20 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || isOffline}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    {isSupported && (
                      <button
                        onClick={handleMicClick}
                        disabled={isOffline || isLoading}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/10'}`}
                      >
                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-center text-white/20 mt-4 uppercase tracking-[0.2em]">Wisey AI can make mistakes. Verify important info.</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
