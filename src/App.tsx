/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
import { SubjectCard } from './components/SubjectCard';
import { SubjectDashboard } from './components/SubjectDashboard';
import { AITutorHub } from './components/AITutorHub';
import { ChatBot } from './components/ChatBot';
import { AchievementOverlay } from './components/AchievementOverlay';
import { SearchPortal } from './components/SearchPortal';
import { FeedbackModal } from './components/FeedbackModal';
import { useOffline } from './hooks/useOffline';
import { WifiOff, CloudOff, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'subject'>('home');
  const [activeSubject, setActiveSubject] = useState<SubjectModule | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAITutorHub, setShowAITutorHub] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<11 | 12 | 'all'>('all');
  const [initialTopic, setInitialTopic] = useState<Topic | null>(null);
  const isOffline = useOffline();

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
    setActiveSubject(subject);
    setInitialTopic(topic || null);
    setCurrentView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-mesh overflow-x-hidden pb-24">
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
            className="pt-32 px-6 md:px-12 max-w-screen-2xl mx-auto"
          >
            {/* Hero Section */}
            <header className="mb-20 text-center md:text-left">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
              >
                The Future of Learning
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-serif font-black tracking-tight mb-4"
              >
                Master the <br />
                <span className="text-orange-500 italic">Commerce</span> World.
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/30 mb-8"
              >
                Created by karthik
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/40 text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
              >
                Interactive dashboards, AI-powered insights, and premium learning materials 
                designed specifically for the modern commerce student.
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center md:justify-start gap-4"
              >
                <button className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-2xl scale-100 hover:scale-105 transition-all">
                  Start Free Trial
                </button>
                <button className="px-10 py-4 glass border border-white/10 hover:bg-white/10 text-white rounded-full font-bold transition-all">
                  Browse Catalog
                </button>
              </motion.div>
            </header>

            {/* Subject Grid */}
            <section>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold">Subject Catalog</h2>
                  <p className="text-white/40 text-sm italic mt-1">Select your focus area to begin exploring.</p>
                </div>
                
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setSelectedGrade('all')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedGrade === 'all' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    All Grades
                  </button>
                  <button 
                    onClick={() => setSelectedGrade(11)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedGrade === 11 ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    Class 11
                  </button>
                  <button 
                    onClick={() => setSelectedGrade(12)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedGrade === 12 ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                  >
                    Class 12
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUBJECTS.filter(s => {
                  if (selectedGrade === 'all') return true;
                  if (selectedGrade === 11) return s.class11.length > 0;
                  if (selectedGrade === 12) return s.class12.length > 0;
                  return true;
                }).map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                  >
                    <SubjectCard 
                      subject={subject} 
                      onClick={() => handleSelectSubject(subject)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Features Preview */}
            <section className="mt-40 grid md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center"><CalcIcon className="text-orange-500" /></div>
                <h4 className="text-xl font-bold font-serif">Smart Calculators</h4>
                <p className="text-sm text-white/40 leading-relaxed">Integrated tools for SI, Ratio Analysis, and Economics equations.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center"><BarChart3 className="text-orange-500" /></div>
                <h4 className="text-xl font-bold font-serif">Interactive Graphs</h4>
                <p className="text-sm text-white/40 leading-relaxed">Visualize Demand/Supply curves and Financial trends in real-time.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center"><BrainCircuit className="text-orange-500" /></div>
                <h4 className="text-xl font-bold font-serif">Adaptive Quizzes</h4>
                <p className="text-sm text-white/40 leading-relaxed">Gamified assessment system that scales with your knowledge level.</p>
              </div>
            </section>

          </motion.main>
        ) : (
          activeSubject && (
            <SubjectDashboard 
              key={activeSubject.id} 
              subject={activeSubject} 
              onBack={() => setCurrentView('home')} 
              onSwitchSubject={handleSelectSubject}
              initialTopic={initialTopic}
            />
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
