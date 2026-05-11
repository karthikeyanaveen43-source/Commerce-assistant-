import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Target, Clock, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { SubjectModule } from '../types';
import { getProgress, setGoal } from '../lib/progressStore';

interface ProgressChartsProps {
  subject: SubjectModule;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ subject }) => {
  const progress = getProgress();
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(progress.goals.targetCompletion);

  const chapters = [...subject.class11, ...subject.class12];
  const allTopics = chapters.flatMap(c => c.topics);
  
  const chapterData = chapters.map(chapter => {
    const topicIds = chapter.topics.map(t => t.id);
    const completedCount = topicIds.filter(id => progress.completedTopics.includes(id)).length;
    
    const timeSpent = topicIds.reduce((acc, id) => acc + (progress.timeSpent[id] || 0), 0);

    return {
      name: chapter.title.substring(0, 12) + '...',
      fullName: chapter.title,
      completed: completedCount,
      total: chapter.topics.length,
      percentage: Math.round((completedCount / chapter.topics.length) * 100),
      timeMinutes: Math.round(timeSpent / 60)
    };
  });

  const totalTimeSeconds = Object.values(progress.timeSpent).reduce((a, b) => a + b, 0);
  const totalMinutes = Math.floor(totalTimeSeconds / 60);

  const handleSaveGoal = () => {
    setGoal(tempGoal);
    setEditingGoal(false);
  };

  const handleShare = () => {
    const text = `I've mastered ${progress.completedTopics.length} commerce concepts and spent ${totalMinutes} minutes learning on Commerce Assistant! 🚀 #CommerceLearning #AcademicSuccess`;
    if (navigator.share) {
      navigator.share({ title: 'My Learning Progress', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Progress summary copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-serif font-bold italic text-white/80">Performance Dashboard</h3>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold transition-all border border-white/10 uppercase tracking-widest"
        >
          Share Progress
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 glass border-white/5 rounded-[2.5rem] bg-orange-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-white/30">Total Focus Time</h5>
          </div>
          <p className="text-4xl font-serif font-black text-white">{totalMinutes} <span className="text-xl font-sans font-normal opacity-40">Mins</span></p>
        </div>

        <div className="p-8 glass border-white/5 rounded-[2.5rem] bg-blue-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-white/30">Learning Goal</h5>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-serif font-black text-white">{progress.goals.targetCompletion}%</p>
            <button 
              onClick={() => setEditingGoal(true)}
              className="text-[10px] uppercase font-bold text-blue-500 hover:underline"
            >
              Update Goal
            </button>
          </div>
        </div>

        <div className="p-8 glass border-white/5 rounded-[2.5rem] bg-emerald-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <h5 className="text-[10px] uppercase font-bold tracking-widest text-white/30">Concepts Mastered</h5>
          </div>
          <p className="text-4xl font-serif font-black text-white">{progress.completedTopics.length} <span className="text-xl font-sans font-normal opacity-40">Topics</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Spend per Chapter Chart */}
        <div className="p-8 glass border-white/5 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8 text-left">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30">Time Allocation</h4>
              <p className="text-lg font-serif font-bold italic">Where you spend your focus</p>
            </div>
            <TrendingUp className="w-5 h-5 text-orange-500/50" />
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chapterData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f27d26" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f27d26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Area type="monotone" dataKey="timeMinutes" stroke="#f27d26" fillOpacity={1} fill="url(#colorTime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Original Chapter Mastery Bar Chart */}
        <div className="p-8 glass border-white/5 rounded-[2.5rem]">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-8 self-start">Curriculum Mastery (%)</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chapterData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#1a1a1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                  {chapterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.percentage >= 80 ? '#10b981' : entry.percentage >= 40 ? '#f27d26' : '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {editingGoal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="w-full max-w-sm glass-card p-8 rounded-[3rem] text-center border-orange-500/20">
            <Target className="w-12 h-12 text-orange-500 mx-auto mb-6" />
            <h4 className="text-2xl font-serif font-bold mb-2">Set Learning Goal</h4>
            <p className="text-white/40 mb-8 text-sm">Target completion percentage for this course.</p>
            
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={tempGoal} 
              onChange={(e) => setTempGoal(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-4"
            />
            <p className="text-3xl font-black text-white mb-8">{tempGoal}%</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setEditingGoal(false)}
                className="flex-1 py-4 bg-white/5 rounded-2xl font-bold border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveGoal}
                className="flex-1 py-4 bg-orange-500 rounded-2xl font-bold shadow-lg shadow-orange-500/20"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
