/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Calculator as CalcIcon,
  BarChart3,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import { SUBJECTS } from './constants';
import { SubjectModule, Topic } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SubjectCard } from './components/SubjectCard';
import { SubjectDashboard } from './components/SubjectDashboard';
import { AITutorHub } from './components/AITutorHub';
import { ChatBot } from './components/ChatBot';
import { AchievementOverlay } from './components/AchievementOverlay';
import { SearchPortal } from './components/SearchPortal';
import { FeedbackModal } from './components/FeedbackModal';
import { useOffline } from './hooks/useOffline';
import { WifiOff, CloudOff, MessageSquare, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'subject'>('home');
  const [activeSubject, setActiveSubject] = useState<SubjectModule | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAITutorHub, setShowAITutorHub] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<11 | 12 | 'all'>('all');
  const [initialTopic, setInitialTopic] = useState<Topic | null>(null);
  const isOffline = useOffline();

  const catalogRef = useRef<HTMLElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Desktop Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search Shortcut (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Close Modals (Esc)
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowFeedback(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSubject = (subject: SubjectModule, topic?: Topic) => {
    localStorage.setItem('lastSubjectId', subject.id);
    setActiveSubject(subject);
    setInitialTopic(topic || null);
    setCurrentView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resumeLearning = () => {
    const lastId = localStorage.getItem('lastSubjectId');
    if (lastId) {
      const subject = SUBJECTS.find(s => s.id === lastId);
      if (subject) handleSelectSubject(subject);
    } else {
      scrollToCatalog();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      <Navbar 
        onHome={() => setCurrentView('home')} 
        onSearch={() => setShowSearch(true)} 
        onOpenTutor={() => setShowAITutorHub(true)}
      />
      
      {isOffline && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white py-2 px-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest"
        >
          <WifiOff className="w-4 h-4" />
          Offline Mode: AI Features Disabled | Course Material (Cached) & Notes Available
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            {/* Hero Section - Standard Web Landing style */}
            <div className="relative pt-48 pb-32 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
               {/* Background Accents */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-orange-500/10 to-transparent blur-[120px] pointer-events-none" />

               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
               >
                 <ShieldCheck className="w-4 h-4" /> The Intelligent Digital Portal
               </motion.div>

               <motion.h1 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3 }}
                 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter mb-8 leading-[0.9]"
               >
                 Future of <br />
                 <span className="text-orange-500 italic">Commerce.</span>
               </motion.h1>

               <motion.p 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="text-white/40 text-lg md:text-2xl max-w-3xl leading-relaxed mb-12 italic font-serif"
               >
                 Transforming traditional textbooks into a living, AI-powered interactive masterclass portal for the next generation of business leaders.
               </motion.p>
               
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="flex flex-col sm:flex-row items-center gap-6"
               >
                 <button 
                  onClick={resumeLearning}
                  className="px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-[0_0_40px_rgba(242,125,38,0.3)] hover:scale-105 transition-all text-sm uppercase tracking-widest"
                 >
                   {localStorage.getItem('lastSubjectId') ? 'Resume Learning' : 'Explore Portal'}
                 </button>
                 <button 
                  onClick={() => setShowAITutorHub(true)}
                  className="px-12 py-5 glass border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold transition-all text-sm uppercase tracking-widest flex items-center gap-3"
                 >
                   <Zap className="w-5 h-5 text-orange-500" /> Start AI Lecture
                 </button>
               </motion.div>

               <div className="mt-20 flex gap-12 items-center text-white/20 select-none">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> <span className="text-[10px] uppercase font-black tracking-[0.2em]">Global Curriculum</span></div>
                  <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> <span className="text-[10px] uppercase font-black tracking-[0.2em]">Verified Content</span></div>
               </div>
            </div>

            {/* Educational Mission Section */}
            <section className="py-24 px-6 md:px-12 bg-white/[0.02] border-y border-white/5">
               <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                  <div>
                    <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-orange-500 mb-6 font-sans">Our Mission</h4>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 italic leading-tight">
                       Redefining the relationship <br /> between student and knowledge.
                    </h2>
                    <p className="text-white/40 leading-relaxed text-lg italic mb-8">
                       Our digital portal isn't just a reading experience—it's a dialogue. By integrating Google's Gemini AI, we provide instant context, real-world case studies, and personalized deep-dives for every commerce topic.
                    </p>
                    <div className="flex gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-2xl font-bold text-white">98%</p>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Concept Retention</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-2xl font-bold text-white">4.2x</p>
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Faster Learning</p>
                       </div>
                    </div>
                  </div>
                  <div className="relative">
                     <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-orange-500/20 to-blue-500/20 glass border border-white/10 flex items-center justify-center p-12 overflow-hidden group">
                        <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <BrainCircuit className="w-48 h-48 text-orange-500/40 group-hover:scale-110 transition-transform duration-1000" />
                     </div>
                     <div className="absolute -top-6 -right-6 p-6 glass border border-white/10 rounded-3xl shadow-2xl animate-bounce">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                     </div>
                  </div>
               </div>
            </section>

            {/* Subject Catalog Section */}
            <section ref={catalogRef} className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
                <div className="max-w-2xl">
                  <h2 className="text-5xl font-serif font-bold text-white mb-4 italic">The Masterclass Series</h2>
                  <p className="text-white/40 text-xl leading-relaxed italic">Curated textbook modules across the core commerce domains. Select a unit to begin your interactive deep-dive.</p>
                </div>
                
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                  {[
                    { id: 'all', label: 'Complete Portal' },
                    { id: 11, label: 'Class 11' },
                    { id: 12, label: 'Class 12' }
                  ].map((btn) => (
                    <button 
                      key={btn.id}
                      onClick={() => setSelectedGrade(btn.id as any)}
                      className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedGrade === btn.id ? 'bg-orange-500 text-white shadow-xl' : 'text-white/30 hover:text-white'}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SUBJECTS.filter(s => {
                  if (selectedGrade === 'all') return true;
                  if (selectedGrade === 11) return s.class11.length > 0;
                  if (selectedGrade === 12) return s.class12.length > 0;
                  return true;
                }).map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SubjectCard 
                      subject={subject} 
                      onClick={() => handleSelectSubject(subject)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Features Spotlight */}
            <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto w-full border-t border-white/5">
              <div className="grid md:grid-cols-3 gap-16">
                {[
                  { icon: <CalcIcon className="w-8 h-8" />, title: "Precision Analytics", desc: "Access high-fidelity calculators for Ratio Analysis and Economic Equilibrium modeling." },
                  { icon: <BarChart3 className="w-8 h-8" />, title: "Live Synthesis", desc: "Visualize changing market dynamics with interactive demand-supply visualizations." },
                  { icon: <BrainCircuit className="w-8 h-8" />, title: "Cognitive Mastery", desc: "Leverage AI-driven mnemonics and case studies to anchor complex business theory." }
                ].map((f, i) => (
                  <div key={i} className="group">
                    <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 group-hover:bg-orange-500 transition-all group-hover:shadow-[0_0_30px_rgba(242,125,38,0.4)]">
                       <div className="text-orange-500 group-hover:text-white transition-colors">
                        {f.icon}
                       </div>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-white mb-4 italic">{f.title}</h4>
                    <p className="text-white/40 leading-relaxed italic">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <Footer />
          </motion.main>
        ) : (
          activeSubject && (
            <>
              <SubjectDashboard 
                key={activeSubject.id} 
                subject={activeSubject} 
                onBack={() => setCurrentView('home')} 
                onSwitchSubject={handleSelectSubject}
                initialTopic={initialTopic}
              />
              <Footer />
            </>
          )
        )}
      </AnimatePresence>
      
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      
      <ChatBot context={activeSubject ? `Subject: ${activeSubject.name}. Code: ${activeSubject.code}. Description: ${activeSubject.description}` : undefined} />
      <AchievementOverlay />

      <AnimatePresence>
        {showSearch && (
          <SearchPortal 
            onClose={() => setShowSearch(false)} 
            onSelectTopic={(subject, topic) => handleSelectSubject(subject, topic)} 
          />
        )}
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        )}
        {showAITutorHub && (
          <AITutorHub onClose={() => setShowAITutorHub(false)} />
        )}
      </AnimatePresence>

      {/* Floating Feedback Button */}
      <button 
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-32 right-8 w-14 h-14 bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 rounded-full flex items-center justify-center transition-all z-40 backdrop-blur-md group"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
