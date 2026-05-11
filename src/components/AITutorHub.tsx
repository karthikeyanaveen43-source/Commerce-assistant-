import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Search, 
  X, 
  MessageSquare, 
  FileText, 
  Video, 
  ChevronRight,
  Brain,
  History,
  Volume2,
  Headphones,
  Briefcase,
  Calculator,
  Loader2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { getGeminiResponse } from '../services/geminiService';
import Markdown from 'react-markdown';
import { SUBJECTS } from '../constants';
import { SubjectModule } from '../types';

interface AITutorHubProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const AITutorHub: React.FC<AITutorHubProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "# Welcome to your AI Masterclass\nI am your dedicated Commerce Tutor. Whether you're struggling with *Macroeconomics*, *Corporate Accounting*, or *Business Law*, I'm here to provide depth and clarity.\n\n**How can I assist your studies today?**",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'catalogue' | 'resources' | 'insights'>('catalogue');
  const [selectedSubject, setSelectedSubject] = useState<SubjectModule | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { speak, listen, isListening, isSupported, stopSpeaking } = useSpeech();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getGeminiResponse(text, messages.map(m => ({ role: m.role, content: m.content })).slice(-5));
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    listen((text) => {
      handleSend(text);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-[#050506] flex flex-col"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-tight">AI Tutor Hub</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Learning Session
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('catalogue')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'catalogue' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Masterclass Catalogue
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            AI Q&A Hub
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'resources' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            Study Vaults
          </button>
        </nav>

        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
        >
          <X className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
        </button>
      </header>

      <main className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Sidebar: Context & Quick Actions */}
        <div className="hidden xl:flex w-80 border-r border-white/5 p-8 flex-col gap-8 bg-black/20">
          <div>
            <h4 className="text-[10px] uppercase font-bold text-orange-500 tracking-[0.3em] mb-6">Subject Filter</h4>
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedSubject(null)}
                className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-bold uppercase tracking-widest ${!selectedSubject ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
              >
                All Domains
              </button>
              {SUBJECTS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedSubject(s)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest ${selectedSubject?.id === s.id ? 'bg-orange-500 text-white border-orange-400 shadow-xl' : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-6 glass rounded-[2.5rem] border-blue-500/20 bg-blue-500/5">
             <Trophy className="w-6 h-6 text-blue-400 mb-4" />
             <h5 className="text-sm font-bold text-white mb-1">Study Streak</h5>
             <p className="text-[10px] text-white/40 uppercase tracking-widest">You're in the top 5% of active learners today.</p>
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex-1 flex flex-col relative bg-[#0a0a0b]/40">
          {activeTab === 'catalogue' ? (
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               <div className="max-w-6xl mx-auto">
                 <div className="flex items-end justify-between mb-12">
                   <div>
                     <h2 className="text-4xl font-serif font-bold text-white mb-2 italic">Masterclass Catalogue</h2>
                     <p className="text-white/40 italic">Choose a course module to start a deep-dive AI teaching session.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{selectedSubject?.name || 'All Subjects'}</span>
                      </div>
                   </div>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-8 pb-20">
                   {SUBJECTS.filter(s => !selectedSubject || s.id === selectedSubject.id).map(subject => (
                     <div key={subject.id} className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                           <div className="w-2 h-8 bg-orange-500 rounded-full" />
                           <h3 className="text-xl font-serif font-bold italic text-white/80">{subject.name} Modules</h3>
                        </div>
                        <div className="grid gap-4">
                           {subject.class12.map((chapter, chapterIdx) => (
                             <motion.div 
                               key={chapter.id}
                               whileHover={{ x: 10 }}
                               className="p-6 glass border-white/5 hover:border-orange-500/30 rounded-[2rem] transition-all cursor-pointer group bg-white/[0.02] flex items-center justify-between"
                               onClick={() => {
                                 setActiveTab('chat');
                                 handleSend(`I want to start a Masterclass on the chapter: ${chapter.title} from ${subject.name}. Please give me a detailed overview.`);
                               }}
                             >
                                <div className="flex items-center gap-6">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-orange-500 group-hover:text-white transition-all font-black text-xs">
                                      {chapterIdx + 1}
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black tracking-widest text-orange-500 uppercase mb-1">Class 12 • UNIT {chapterIdx + 1}</p>
                                      <h4 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">{chapter.title}</h4>
                                      <p className="text-xs text-white/30 italic mt-1">{chapter.topics.length} Expert Concepts</p>
                                   </div>
                                </div>
                                <div className="p-3 rounded-full bg-white/5 group-hover:bg-orange-500 opacity-0 group-hover:opacity-100 transition-all">
                                   <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                             </motion.div>
                           ))}
                           {subject.class11.map((chapter, chapterIdx) => (
                             <motion.div 
                               key={chapter.id}
                               whileHover={{ x: 10 }}
                               className="p-6 glass border-white/5 hover:border-blue-500/30 rounded-[2rem] transition-all cursor-pointer group bg-white/[0.02] flex items-center justify-between"
                               onClick={() => {
                                 setActiveTab('chat');
                                 handleSend(`I want to learn about ${chapter.title} from ${subject.name} (Class 11). Start with an introduction.`);
                               }}
                             >
                                <div className="flex items-center gap-6">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500 group-hover:text-white transition-all font-black text-xs">
                                      {chapterIdx + 1}
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-1">Class 11 • UNIT {chapterIdx + 1}</p>
                                      <h4 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors">{chapter.title}</h4>
                                      <p className="text-xs text-white/30 italic mt-1">{chapter.topics.length} Core Concepts</p>
                                   </div>
                                </div>
                                <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                                   <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          ) : activeTab === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] md:max-w-2xl flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${msg.role === 'user' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                         {msg.role === 'user' ? <Search className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                      </div>
                      <div className={`rounded-3xl p-6 md:p-8 relative group transition-all duration-500 ${msg.role === 'user' ? 'bg-blue-500/5 border border-blue-500/20 text-white rounded-tr-none' : 'glass border-white/5 text-white/80 rounded-tl-none shadow-2xl'}`}>
                        <div className="prose prose-invert prose-orange max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                        {msg.role === 'bot' && (
                          <div className="absolute -right-12 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => speak(msg.content)}
                               className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10"
                               title="Listen to Explanation"
                             >
                               <Volume2 className="w-4 h-4" />
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                         <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                      </div>
                      <p className="text-xs font-bold text-white/30 uppercase tracking-widest animate-pulse">Consulting Study Vaults...</p>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                 <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <div className="relative flex-1 group">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about a formula, concept, or case study..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 pr-20 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all focus:bg-white/[0.07] group-hover:bg-white/[0.08]"
                      />
                      <button 
                         onClick={() => handleSend()}
                         disabled={!input.trim() || loading}
                         className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                      >
                         <Send className="w-5 h-5" />
                      </button>
                    </div>
                    {isSupported && (
                      <button 
                        onClick={handleVoiceInput}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border ${isListening ? 'bg-red-500 text-white animate-pulse border-red-400' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border-white/10'}`}
                      >
                        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>
                    )}
                 </div>
                 <div className="flex justify-center gap-6 mt-6">
                    {['Explain the Golden Rules of Accounting', 'Summarize Macro vs Micro Economics', 'Top 5 Business Case Studies'].map((chip, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(chip)}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-orange-500 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                 </div>
              </div>
            </>
          ) : activeTab === 'resources' ? (
            <div className="flex-1 overflow-y-auto p-12 space-y-12 max-w-5xl mx-auto w-full custom-scrollbar">
               <div className="text-center mb-16">
                 <div className="w-20 h-20 rounded-[2rem] bg-orange-500/10 flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                    <BookOpen className="w-10 h-10 text-orange-500" />
                 </div>
                 <h2 className="text-4xl font-serif font-bold text-white mb-4 italic">Resource Forge</h2>
                 <p className="text-white/40 max-w-xl mx-auto italic tracking-wide">Select a dynamic resource type and provide a topic. My AI will generate a tailored study kit for you instantly.</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                 {[
                   { title: "Case Study Generator", desc: "Real-world business scenarios based on any commerce concept.", icon: <Briefcase /> },
                   { title: "Practice Problem Set", desc: "Calculation-heavy problems for Accountancy and Economics.", icon: <Calculator /> },
                   { title: "Cheat Sheet Creator", desc: "A concise summary of formulas and definitions.", icon: <FileText /> },
                   { title: "VIVA Readiness Kit", desc: "Possible oral exam questions and model answers.", icon: <MessageSquare /> }
                 ].map((tool, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -5 }}
                     className="p-8 glass border-white/5 rounded-[2.5rem] hover:border-orange-500/20 transition-all cursor-pointer group bg-white/[0.01]"
                     onClick={() => {
                       setActiveTab('chat');
                       handleSend(`Generate a ${tool.title} for me. I want to focus on...`);
                     }}
                   >
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all text-white/40">
                       {React.cloneElement(tool.icon as React.ReactElement, { className: 'w-6 h-6' })}
                     </div>
                     <h4 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">{tool.title}</h4>
                     <p className="text-sm text-white/40 leading-relaxed mb-6 italic">{tool.desc}</p>
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                       Forge Resource <ChevronRight className="w-4 h-4" />
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-12 space-y-12 max-w-5xl mx-auto w-full custom-scrollbar">
               <div className="text-center mb-16">
                 <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <History className="w-10 h-10 text-emerald-500" />
                 </div>
                 <h2 className="text-4xl font-serif font-bold text-white mb-4 italic">Exam Strategy</h2>
                 <p className="text-white/40 max-w-xl mx-auto italic tracking-wide">Analyze past year papers and get trend-based insights for your upcoming commerce examinations.</p>
               </div>
               <div className="p-12 glass border-white/5 rounded-[3rem] text-center bg-white/[0.02]">
                  <Sparkles className="w-12 h-12 text-orange-500 mx-auto mb-6" />
                  <p className="text-white/30 text-sm uppercase tracking-[0.2em] font-bold">Exam Analysis Module coming soon</p>
               </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Contextual Tools */}
        <div className="hidden 2xl:flex w-96 border-l border-white/5 p-10 flex-col gap-10 bg-black/20">
           <div>
             <h4 className="text-[10px] uppercase font-bold text-orange-500 tracking-[0.3em] mb-8">AI Masterclass Mode</h4>
             <div className="p-8 glass rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl rounded-full" />
                <Headphones className="w-10 h-10 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                <h5 className="text-xl font-serif font-bold text-white mb-3">Immersive Audio Lecture</h5>
                <p className="text-xs text-white/40 leading-relaxed mb-6 uppercase tracking-wider">Turn any topic into a professional audio lecture narrated by our AI educator.</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest animate-pulse">
                   <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Waiting for Topic
                </div>
             </div>
           </div>

           <div>
              <h4 className="text-[10px] uppercase font-bold text-blue-500 tracking-[0.3em] mb-8">Live Statistics</h4>
              <div className="space-y-6">
                {[
                  { label: "Questions Solved", value: "14", color: "blue" },
                  { label: "Concepts Mastered", value: "3", color: "orange" },
                  { label: "Study Credits", value: "128", color: "emerald" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-default">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest group-hover:text-white/50 transition-colors">{stat.label}</span>
                    <span className={`text-lg font-black text-${stat.color}-500 tracking-tighter`}>{stat.value}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </main>
    </motion.div>
  );
};
