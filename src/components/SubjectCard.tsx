import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { BookOpen, ChevronRight, CheckCircle2, Sparkles, TrendingUp, BarChart3, Briefcase, Globe } from 'lucide-react';
import { SubjectModule } from '../types';
import { getSubjectProgress } from '../lib/progressStore';

const getSubjectIcon = (id: string) => {
  switch (id) {
    case 'economics': return <BarChart3 className="w-6 h-6" />;
    case 'business-studies': return <Briefcase className="w-6 h-6" />;
    case 'accountancy': return <TrendingUp className="w-6 h-6" />;
    case 'entrepreneurship': return <Sparkles className="w-6 h-6" />;
    default: return <Globe className="w-6 h-6" />;
  }
};

const getSubjectColor = (id: string) => {
  switch (id) {
    case 'economics': return 'from-blue-500 to-indigo-600';
    case 'business-studies': return 'from-orange-500 to-red-600';
    case 'accountancy': return 'from-emerald-500 to-teal-600';
    case 'entrepreneurship': return 'from-purple-500 to-pink-600';
    default: return 'from-orange-500 to-red-600';
  }
};

export const SubjectCard = ({ subject, onClick }: { subject: SubjectModule, onClick: () => void }) => {
  const [progress, setProgress] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const updateProgress = () => setProgress(getSubjectProgress(subject));
    updateProgress();
    window.addEventListener('progressUpdated', updateProgress);
    return () => window.removeEventListener('progressUpdated', updateProgress);
  }, [subject]);

  const colorClasses = getSubjectColor(subject.id);

  return (
    <motion.div 
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="glass-card p-0 rounded-[2.5rem] cursor-pointer group transition-all duration-500 relative overflow-hidden h-full flex flex-col border-white/5 hover:border-white/20"
    >
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
      
      <div className="p-8 flex flex-col h-full relative z-10">
        <div className="mb-8 flex justify-between items-start">
          <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br transition-all duration-500 ${colorClasses.replace('from-', 'group-hover:from-').replace('to-', 'group-hover:to-')}`}>
            <div className="group-hover:text-white text-white/50 transition-colors">
              {getSubjectIcon(subject.id)}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors">{subject.code}</span>
            {progress === 100 && (
              <div className="mt-2 flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Mastered
              </div>
            )}
          </div>
        </div>

        <div style={{ transform: "translateZ(50px)" }}>
          <h3 className="text-3xl font-serif font-bold mb-3 group-hover:text-white transition-colors leading-tight">
            {subject.name}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-8 group-hover:text-white/60 transition-colors font-medium">
            {subject.description}
          </p>
        </div>
        
        <div className="mt-auto space-y-4" style={{ transform: "translateZ(30px)" }}>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <span>Course Progress</span>
            <span className="text-white font-mono">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full bg-gradient-to-r ${colorClasses} shadow-[0_0_15px_rgba(242,125,38,0.4)] transition-all relative overflow-hidden`}
            >
               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" />
            </motion.div>
          </div>
          
          <div className="pt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                <div className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                </div>
                Level {Math.floor(progress / 20) + 1}
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
               Enter Course <ChevronRight className="w-4 h-4" />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
