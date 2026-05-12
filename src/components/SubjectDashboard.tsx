import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  LayoutDashboard,
  BrainCircuit,
  FileText,
  Calculator as CalcIcon,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  Trophy,
  FileEdit,
  Video,
  Book,
  BookOpen,
  Volume2,
  Sparkles,
  Timer,
  ChevronLeft,
  ChevronRight,
  Brain,
  Calendar,
  ChevronDown,
  Award,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz } from './Quiz';
import { EconomyGraph } from './EconomyGraph';
import { Calculator } from './Calculator';
import { AILearningPath } from './AILearningPath';
import { NotesSection } from './NotesSection';
import { TopicInsights } from './TopicInsights';
import { VeoVideoGenerator } from './VeoVideoGenerator';
import { TextbookReader } from './TextbookReader';
import { DigitalLibrary } from './DigitalLibrary';
import { AudioNarration } from './AudioNarration';
import { ChapterSummary } from './ChapterSummary';
import { ResourceViewer } from './ResourceViewer';
import { StudyTimer } from './StudyTimer';
import { Flashcards } from './Flashcards';
import { StudyPlanGenerator } from './StudyPlanGenerator';
import { MockExam } from './MockExam';
import { ProgressCharts } from './ProgressCharts';
import { AITeacher } from './AITeacher';
import { TopicSummaryModal } from './TopicSummaryModal';
import { ChapterRecapModal } from './ChapterRecapModal';
import { isTopicCompleted, markTopicComplete, getSubjectProgress, trackEngagement, saveQuizScore, getProgress } from '../lib/progressStore';
import { Chapter, SubjectModule, Topic } from '../types';
import { SUBJECTS } from '../constants';

interface SelectedResource {
  title: string;
  url: string;
}

export const SubjectDashboard: React.FC<{ 
  subject: SubjectModule, 
  onBack: () => void, 
  onSwitchSubject: (s: SubjectModule) => void,
  initialTopic?: Topic | null
}> = ({ subject, onBack, onSwitchSubject, initialTopic }) => {
  const [activeTab, setActiveTab] = useState<'class11' | 'class12'>('class11');
  const [viewMode, setViewMode] = useState<'curriculum' | 'analytics' | 'badges'>('curriculum');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(initialTopic || null);

  React.useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
      setInteractiveMode('content');
      // Determine if initialTopic is in class 11 or 12 to set activeTab
      const isInClass11 = subject.class11.some(c => c.topics.some(t => t.id === initialTopic.id));
      setActiveTab(isInClass11 ? 'class11' : 'class12');
    }
  }, [initialTopic, subject]);
  const [selectedChapterForSummary, setSelectedChapterForSummary] = useState<Chapter | null>(null);
  const [interactiveMode, setInteractiveMode] = useState<'content' | 'quiz' | 'graph' | 'calc' | 'notes' | 'library'>('content');
  const [showVeo, setShowVeo] = useState(false);
  const [showTextbook, setShowTextbook] = useState(false);
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [showMockExam, setShowMockExam] = useState(false);
  const [showAITeacher, setShowAITeacher] = useState(false);
  const [showTopicSummary, setShowTopicSummary] = useState(false);
  const [showChapterRecap, setShowChapterRecap] = useState<Chapter | null>(null);
  const [showSubjectSwitcher, setShowSubjectSwitcher] = useState(false);
  const [showNarration, setShowNarration] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [openResource, setOpenResource] = useState<SelectedResource | null>(null);
  const [, setUpdateTrigger] = useState(0); 

  const progress = getProgress();

  React.useEffect(() => {
    const handleUpdate = () => setUpdateTrigger(prev => prev + 1);
    window.addEventListener('progressUpdated', handleUpdate);
    return () => window.removeEventListener('progressUpdated', handleUpdate);
  }, []);

  const chapters = activeTab === 'class11' ? subject.class11 : subject.class12;
  const overallProgress = getSubjectProgress(subject);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setInteractiveMode('content');
    trackEngagement(topic.id);
  };

  const handleTopicById = (topicId: string) => {
    const allTopics = [...subject.class11, ...subject.class12].flatMap(chapter => chapter.topics);
    const topic = allTopics.find(t => t.id === topicId);
    if (topic) {
      handleTopicSelect(topic);
    }
  };

  const celebrate = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f27d26', '#ffffff', '#10b981']
    });
  };

  const handleMarkComplete = (id: string) => {
    markTopicComplete(id);
    celebrate();
  };

  const getNavigationTopics = () => {
    const allTopics = chapters.flatMap(c => c.topics);
    const currentIndex = allTopics.findIndex(t => t.id === selectedTopic?.id);
    return {
      prev: currentIndex > 0 ? allTopics[currentIndex - 1] : null,
      next: currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null
    };
  };

  const nav = getNavigationTopics();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-28 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-full glass border-white/5 flex items-center justify-center hover:bg-white/10 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowSubjectSwitcher(!showSubjectSwitcher)}
              className="flex items-center gap-3 glass border-white/5 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center font-bold text-orange-500 text-xs">
                {subject.code}
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-white/30 leading-none mb-1">Switch Subject</p>
                <p className="font-bold text-white flex items-center gap-2">
                  {subject.name} <ChevronDown className={`w-4 h-4 transition-transform ${showSubjectSwitcher ? 'rotate-180' : ''}`} />
                </p>
              </div>
            </button>

            <AnimatePresence>
              {showSubjectSwitcher && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 z-50 w-64 glass border-white/10 p-2 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                >
                  {SUBJECTS.filter(s => s.id !== subject.id).map(s => (
                    <button
                      key={s.id}
                      onClick={() => { onSwitchSubject(s); setShowSubjectSwitcher(false); }}
                      className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white/40 text-xs group-hover:bg-orange-500/20 group-hover:text-orange-500">
                        {s.code}
                      </div>
                      <span className="text-sm font-medium text-white/70 group-hover:text-white">{s.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {[
              { id: 'curriculum', label: 'Curriculum', icon: LayoutDashboard },
              { id: 'analytics', label: 'Insights', icon: BarChart3 },
              { id: 'badges', label: 'Awards', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === tab.id ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
          
          <div className="h-10 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Overall Mastery</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    className="h-full bg-orange-500 shadow-[0_0_10px_rgba(242,125,38,0.5)]"
                  />
                </div>
                <span className="text-orange-500 font-bold text-sm">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 text-left">
          <div className="sticky top-28 space-y-6">
            <div>
              <h2 className="text-4xl font-serif font-black mb-2 tracking-tight">{subject.name}</h2>
              <p className="text-white/40 text-xs italic font-serif leading-relaxed">{subject.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <button 
                  onClick={() => setActiveTab('class11')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'class11' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Volume I
                </button>
                <button 
                  onClick={() => setActiveTab('class12')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'class12' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Volume II
                </button>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group/sidebar">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -z-10 group-hover/sidebar:bg-orange-500/10 transition-colors" />
                
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
                     <Book className="w-3.5 h-3.5 text-orange-500" /> Table of Contents
                   </h3>
                   <span className="text-[10px] text-orange-500/50 font-mono">{chapters.length} Chapters</span>
                </div>

                <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {chapters.length > 0 ? chapters.map((chapter, chapterIdx) => (
                    <div key={chapter.id} className="space-y-3">
                      <div className="flex items-center justify-between gap-2 mb-2 px-1">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-black tracking-[0.4em] text-orange-500/60 mb-0.5">
                            Unit {chapterIdx + 1}
                          </span>
                          <h4 className="text-xs font-black text-white/90 leading-tight uppercase tracking-wider">
                            {chapter.title}
                          </h4>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowChapterRecap(chapter);
                          }}
                          className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-600 hover:text-white transition-all border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/5"
                          title="AI Recap"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid gap-1">
                        {chapter.topics.map((topic, topicIdx) => {
                          const completed = isTopicCompleted(topic.id);
                          const isActive = selectedTopic?.id === topic.id;
                          return (
                            <motion.button
                              key={topic.id}
                              onClick={() => handleTopicSelect(topic)}
                              className={`w-full text-left py-2.5 px-3 rounded-xl border flex items-center gap-3 transition-all group/topic ${
                                isActive 
                                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' 
                                  : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/70'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[9px] border transition-all ${
                                isActive 
                                  ? 'bg-orange-500 text-white border-orange-400' 
                                  : completed 
                                    ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
                                    : 'bg-white/5 border-white/10 text-white/20'
                              }`}>
                                {chapterIdx + 1}.{topicIdx + 1}
                              </div>
                              <span className="text-[11px] font-bold truncate flex-1">{topic.title}</span>
                              {completed && <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-50" />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center glass border-dashed border-white/10 rounded-2xl opacity-50 italic text-xs">
                      Content coming soon.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                 <button 
                  onClick={() => setShowStudyPlan(true)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs"
                 >
                   <Calendar className="w-4 h-4 text-orange-500" /> 
                   <span className="font-bold">Portal Schedule</span>
                 </button>
                 <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setInteractiveMode('calc')}
                      className={`flex items-center gap-2 p-3.5 rounded-2xl border text-xs transition-all ${interactiveMode === 'calc' ? 'bg-orange-500 text-white' : 'bg-white/[0.03] border-white/5 text-white/40'}`}
                    >
                      <CalcIcon className="w-4 h-4" /> <span className="font-bold">Tools</span>
                    </button>
                    <button 
                      onClick={() => setInteractiveMode('library')}
                      className={`flex items-center gap-2 p-3.5 rounded-2xl border text-xs transition-all ${interactiveMode === 'library' ? 'bg-orange-500 text-white' : 'bg-white/[0.03] border-white/5 text-white/40'}`}
                    >
                      <BookOpen className="w-4 h-4" /> <span className="font-bold">Library</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 text-left">
          <AnimatePresence mode="wait">
            {viewMode === 'analytics' ? (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProgressCharts subject={subject} />
              </motion.div>
            ) : viewMode === 'badges' ? (
              <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {progress.badges.length > 0 ? progress.badges.map(badge => (
                    <div key={badge.id} className="p-6 glass border-yellow-500/20 bg-yellow-500/5 rounded-3xl flex items-center gap-6 border-2">
                       <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                         {badge.icon === 'trophy' ? <Trophy className="w-8 h-8 text-yellow-500" /> : <Award className="w-8 h-8 text-yellow-500" />}
                       </div>
                       <div>
                         <h4 className="font-bold text-white mb-1">{badge.name}</h4>
                         <p className="text-white/40 text-[10px] leading-tight">{badge.description}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="col-span-full p-20 text-center glass border-dashed border-white/10 rounded-[3rem] opacity-30">
                       <Trophy className="w-12 h-12 mx-auto mb-4" />
                       <h4 className="text-xl font-serif font-bold">No achievements yet</h4>
                       <p className="text-sm">Complete mock exams and finish topics to unlock badges.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : interactiveMode === 'calc' ? (
              <motion.div key="calc" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-[2.5rem] overflow-hidden min-h-[600px]">
                <div className="p-8 border-b border-white/10 flex justify-between items-center text-left">
                  <h3 className="text-2xl font-serif font-bold italic">Financial Calculators</h3>
                  <button onClick={() => setInteractiveMode('content')} className="text-xs text-white/40 hover:text-white">Close Tool</button>
                </div>
                <Calculator />
              </motion.div>
            ) : interactiveMode === 'graph' ? (
              <motion.div key="graph" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-[2.5rem] overflow-hidden min-h-[600px] p-8">
                <div className="flex justify-between items-center mb-8 text-left">
                  <h3 className="text-2xl font-serif font-bold italic text-white/90">Economic Visualizations</h3>
                  <button onClick={() => setInteractiveMode('content')} className="text-xs text-white/40 hover:text-white">Close Tool</button>
                </div>
                <EconomyGraph />
              </motion.div>
            ) : interactiveMode === 'library' ? (
              <motion.div key="library" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-[2.5rem] overflow-hidden min-h-[600px] p-8 md:p-12">
                <div className="flex justify-end mb-4">
                   <button onClick={() => setInteractiveMode('content')} className="text-xs text-white/40 hover:text-white">Close Library</button>
                </div>
                <DigitalLibrary 
                  resources={subject.externalResources || []} 
                  activeGrade={activeTab === 'class11' ? 11 : 12} 
                  onSelectResource={(res) => setOpenResource({ title: res.title, url: res.url })}
                />
              </motion.div>
            ) : selectedTopic ? (
              <motion.div
                key={selectedTopic.id + interactiveMode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px]"
              >
                {interactiveMode === 'quiz' ? (
                  <Quiz 
                    topicTitle={selectedTopic.title}
                    topicContent={selectedTopic.content}
                    onComplete={(score) => {
                      saveQuizScore(selectedTopic.id, (score / 5) * 100);
                      markTopicComplete(selectedTopic.id);
                      setInteractiveMode('content');
                    }} 
                    onClose={() => setInteractiveMode('content')} 
                  />
                ) : (
                  <>
                    <div className="p-8 md:p-12 border-b border-white/10 text-left">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-orange-500/20 border border-orange-400">
                             {chapters.findIndex(c => c.topics.some(t => t.id === selectedTopic.id)) + 1}.
                             {chapters.find(c => c.topics.some(t => t.id === selectedTopic.id))?.topics.findIndex(t => t.id === selectedTopic.id)! + 1}
                           </div>
                           <span className="text-xs font-bold uppercase tracking-[0.4em] text-orange-500 block">Digital Masterclass</span>
                        </div>
                        {isTopicCompleted(selectedTopic.id) && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </div>
                        )}
                      </div>
                      <h3 className="text-4xl font-serif font-bold mb-6">{selectedTopic.title}</h3>
                      <div className="flex flex-wrap gap-4">
                        <button 
                          onClick={() => setInteractiveMode('quiz')}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-xs font-bold transition-all glow"
                        >
                          <BrainCircuit className="w-4 h-4" /> Start Dynamic Quiz
                        </button>
                        <button 
                          onClick={() => setShowFlashcards(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-full text-xs font-bold transition-all"
                        >
                          <Brain className="w-4 h-4" /> Flashcards
                        </button>
                        {!isTopicCompleted(selectedTopic.id) && (
                          <button 
                            onClick={() => handleMarkComplete(selectedTopic.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/30 rounded-full text-xs font-bold transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark as Done
                          </button>
                        )}
                        <button onClick={() => setInteractiveMode('graph')} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors">
                          <BarChart3 className="w-4 h-4" /> View Graphs
                        </button>
                        <button 
                          onClick={() => setShowVeo(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-full text-xs font-bold transition-all"
                        >
                          <Video className="w-4 h-4" /> Veo Explainer
                        </button>
                        <button 
                          onClick={() => setShowAITeacher(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 rounded-full text-xs font-bold transition-all glow"
                        >
                          <GraduationCap className="w-4 h-4" /> AI Teacher Mode
                        </button>
                        <button 
                          onClick={() => setShowTextbook(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-full text-xs font-bold transition-all"
                        >
                          <Book className="w-4 h-4" /> Textbook Mode
                        </button>
                        <button 
                          onClick={() => setShowNarration(!showNarration)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${showNarration ? 'bg-orange-500 text-white' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20'}`}
                        >
                          <Volume2 className="w-4 h-4" /> Audio Lesson
                        </button>
                        <button 
                          onClick={() => setInteractiveMode('notes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${interactiveMode === 'notes' ? 'bg-orange-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                          <FileEdit className="w-4 h-4" /> My Notes
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8 md:p-12 bg-black/20 flex-grow text-left">
                      {interactiveMode === 'notes' ? (
                        <NotesSection topicId={selectedTopic.id} />
                      ) : (
                        <>
                          <div className="flex items-start gap-4 p-6 bg-orange-500/5 border-l-4 border-orange-500 rounded-r-2xl mb-8 relative group">
                            <Lightbulb className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                            <div>
                              <div className="flex justify-between items-start">
                                <h5 className="text-orange-500 font-bold mb-1 uppercase text-[10px] tracking-widest">Concept Summary</h5>
                                <button 
                                  onClick={() => setShowTopicSummary(true)}
                                  className="text-[10px] font-bold uppercase tracking-widest text-orange-500/50 hover:text-orange-500 flex items-center gap-1 transition-colors"
                                >
                                  <Sparkles className="w-3 h-3" /> Quick AI Summary
                                </button>
                              </div>
                              <p className="text-white/70 text-sm italic">{selectedTopic.description}</p>
                            </div>
                          </div>

                          <AnimatePresence>
                            {showNarration && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 overflow-hidden"
                              >
                                <AudioNarration text={selectedTopic.content} title={selectedTopic.title} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <div className="prose prose-invert max-w-none mb-12">
                            <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap">{selectedTopic.content}</p>
                          </div>

                          {/* Advanced AI Insights Section */}
                          <div className="mb-12 pt-12 border-t border-white/5">
                            <TopicInsights topicTitle={selectedTopic.title} topicContent={selectedTopic.content} />
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4 py-12 border-t border-white/5">
                            {nav.prev && (
                              <button 
                                onClick={() => handleTopicSelect(nav.prev!)}
                                className="flex-1 p-6 glass border-white/5 rounded-3xl hover:bg-white/10 transition-all text-left flex items-center gap-4 group"
                              >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <ChevronLeft className="w-5 h-5 text-white/50" />
                                </div>
                                <div className="text-left">
                                  <p className="text-[10px] uppercase font-bold text-white/30 mb-1">Previous Lesson</p>
                                  <p className="font-bold text-white/80 group-hover:text-white transition-colors">{nav.prev.title}</p>
                                </div>
                              </button>
                            )}
                            {nav.next && (
                              <button 
                                onClick={() => handleTopicSelect(nav.next!)}
                                className="flex-1 p-6 glass border-white/5 rounded-3xl hover:bg-white/10 transition-all text-right flex items-center justify-end gap-4 group"
                              >
                                <div className="text-right">
                                  <p className="text-[10px] uppercase font-bold text-white/30 mb-1">Next Lesson</p>
                                  <p className="font-bold text-white/80 group-hover:text-white transition-colors">{nav.next.title}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <ChevronRight className="w-5 h-5 text-white" />
                                </div>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="space-y-12">
                <AILearningPath subject={subject} onTopicSelect={handleTopicById} />
                
                <div className="h-full glass border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <LayoutDashboard className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-2">Subject Overview</h3>
                  <p className="text-white/40 max-w-sm">Explore your personalized AI insights above or select a specific unit to start learning.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {showVeo && selectedTopic && (
          <VeoVideoGenerator 
            topicTitle={selectedTopic.title} 
            topicContent={selectedTopic.content} 
            onClose={() => setShowVeo(false)} 
          />
        )}

        {showTextbook && selectedTopic && (
          <TextbookReader 
            topicTitle={selectedTopic.title}
            content={selectedTopic.content}
            onClose={() => setShowTextbook(false)}
          />
        )}

        <AnimatePresence>
          {selectedChapterForSummary && (
            <ChapterSummary 
              chapter={selectedChapterForSummary} 
              onClose={() => setSelectedChapterForSummary(null)} 
            />
          )}
          {openResource && (
            <ResourceViewer 
              title={openResource.title} 
              url={openResource.url} 
              onClose={() => setOpenResource(null)} 
            />
          )}
          {showFlashcards && selectedTopic && (
            <Flashcards 
              topicTitle={selectedTopic.title} 
              topicContent={selectedTopic.content} 
              onClose={() => setShowFlashcards(false)} 
            />
          )}
          {showTimer && (
            <StudyTimer 
              topicId={selectedTopic?.id} 
              onClose={() => setShowTimer(false)} 
            />
          )}
          {showStudyPlan && (
            <StudyPlanGenerator subject={subject} onClose={() => setShowStudyPlan(false)} />
          )}
          {showMockExam && (
            <MockExam subject={subject} onClose={() => setShowMockExam(false)} />
          )}
          {showAITeacher && selectedTopic && (
            <AITeacher 
              subjectName={subject.name}
              topicTitle={selectedTopic.title}
              topicContent={selectedTopic.content}
              onClose={() => setShowAITeacher(false)}
            />
          )}
          {showTopicSummary && selectedTopic && (
            <TopicSummaryModal 
              topicTitle={selectedTopic.title}
              topicContent={selectedTopic.content}
              onClose={() => setShowTopicSummary(false)}
            />
          )}
          {showChapterRecap && (
            <ChapterRecapModal 
              chapterTitle={showChapterRecap.title}
              topicTitles={showChapterRecap.topics.map(t => t.title)}
              onClose={() => setShowChapterRecap(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
