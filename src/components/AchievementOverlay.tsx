import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Award, Zap, BookOpen } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const AchievementOverlay: React.FC = () => {
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const handleBadgeMatch = (e: any) => {
      setActiveBadge(e.detail);
      setTimeout(() => setActiveBadge(null), 5000);
    };

    window.addEventListener('badgeUnlocked', handleBadgeMatch);
    return () => window.removeEventListener('badgeUnlocked', handleBadgeMatch);
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'star': return <Star className="w-8 h-8 text-yellow-500" />;
      case 'zap': return <Zap className="w-8 h-8 text-yellow-500" />;
      case 'book': return <BookOpen className="w-8 h-8 text-yellow-500" />;
      default: return <Award className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <AnimatePresence>
      {activeBadge && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm"
        >
          <div className="mx-4 glass border-yellow-500/20 bg-yellow-500/5 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-4 border-2">
            <div className="w-20 h-20 rounded-[2rem] bg-yellow-500/20 flex items-center justify-center animate-bounce">
              {getIcon(activeBadge.icon)}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-yellow-500 tracking-[0.3em] mb-1">New Achievement Unlocked</p>
              <h3 className="text-xl font-serif font-bold text-white mb-2">{activeBadge.name}</h3>
              <p className="text-white/60 text-sm">{activeBadge.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
