import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Lightbulb, 
  Zap, 
  BookOpen, 
  Building2, 
  Loader2, 
  ChevronRight,
  RefreshCw,
  WifiOff,
  X,
  Brain
} from 'lucide-react';
import { 
  getTopicExplanation, 
  getDeepDive, 
  getCaseStudy, 
  getMnemonics, 
  getPowerSummary 
} from '../services/geminiService';
import { useOffline } from '../hooks/useOffline';

interface TopicInsightsProps {
  topicTitle: string;
  topicContent: string;
}

type InsightMode = 'deep-dive' | 'mnemonic' | 'case-study' | 'summary';

export const TopicInsights: React.FC<TopicInsightsProps> = ({ topicTitle, topicContent }) => {
  const [activeMode, setActiveMode] = useState<InsightMode | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isOffline = useOffline();

  const fetchInsight = async (mode: InsightMode) => {
    if (isOffline) return;
    setActiveMode(mode);
    setLoading(true);
    setInsight(null);
    
    let text = "";
    switch(mode) {
      case 'deep-dive': text = await getDeepDive(topicTitle, topicContent); break;
      case 'case-study': text = await getCaseStudy(topicTitle, topicContent); break;
      case 'mnemonic': text = await getMnemonics(topicTitle, topicContent); break;
      case 'summary': text = await getPowerSummary(topicTitle, topicContent); break;
      default: text = await getTopicExplanation(topicTitle, topicContent, mode);
    }
    
    setInsight(text);
    setLoading(false);
  };

  const modes: { id: InsightMode; icon: any; label: string; desc: string; color: string }[] = [
    { 
      id: 'deep-dive', 
      icon: BookOpen, 
      label: 'Deep Dive', 
      desc: 'Comprehensive pedagogical explanation',
      color: 'text-blue-500' 
    },
    { 
      id: 'case-study', 
      icon: Building2, 
      label: 'Case Study', 
      desc: 'Real-world business applications',
      color: 'text-emerald-500' 
    },
    { 
      id: 'mnemonic', 
      icon: Zap, 
      label: 'Mnemonics', 
      desc: 'Memory hacks and catchy tricks',
      color: 'text-orange-500' 
    },
    { 
      id: 'summary', 
      icon: Lightbulb, 
      label: 'Power Summary', 
      desc: 'Quick 3-point critical revision',
      color: 'text-purple-500' 
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h4 className="text-2xl font-serif font-bold text-white italic">Wisey Advanced Insights</h4>
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">Elevate your understanding with AI diagnostics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => fetchInsight(mode.id)}
            disabled={isOffline || (loading && activeMode !== mode.id)}
            className={`group p-6 rounded-[2rem] border text-left transition-all duration-500 relative overflow-hidden ${
              activeMode === mode.id 
                ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_30px_rgba(242,125,38,0.1)]' 
                : 'glass border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
            } ${isOffline ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <mode.icon className={`w-8 h-8 mb-6 transition-transform group-hover:scale-110 duration-500 ${mode.color}`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold uppercase tracking-widest text-white">{mode.label}</p>
                {isOffline && <WifiOff className="w-3 h-3 text-white/20" />}
              </div>
              <p className="text-[10px] text-white/40 uppercase leading-relaxed tracking-wider">{mode.desc}</p>
            </div>

            {loading && activeMode === mode.id && (
              <div className="absolute bottom-0 left-0 h-1 bg-orange-500 w-full animate-progress" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeMode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="glass-card rounded-[3rem] overflow-hidden border-orange-500/20 shadow-2xl relative"
          >
            {/* Background branding subtle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
              <Sparkles className="w-96 h-96 text-orange-500" />
            </div>

            <div className="p-8 md:p-12 relative z-10">
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h5 className="text-xl font-serif font-bold text-white italic mb-2">Analyzing Topic DNA...</h5>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] animate-pulse">Generating your {activeMode?.replace('-', ' ')}</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                          <Brain className="w-7 h-7 text-white" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">AI Diagnostic Insight</p>
                          <h5 className="text-xl font-serif font-bold text-white italic">Wisey Masterclass: {activeMode?.replace('-', ' ')}</h5>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => fetchInsight(activeMode!)} 
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60 transition-all border border-white/10"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                      <button 
                        onClick={() => setActiveMode(null)}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-white/40 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-white/90 leading-relaxed text-base md:text-lg font-serif italic max-w-4xl mx-auto custom-scrollbar overflow-y-auto max-h-[500px] pr-4">
                    <div className="markdown-body">
                      {insight}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest italic">Authenticity Verified</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest italic">Conceptual Integrity High</span>
                       </div>
                    </div>
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black italic">TradeWise AI • Educational Core v4.2</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
