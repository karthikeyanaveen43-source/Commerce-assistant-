import React, { useState, useMemo } from 'react';
import { Search, X, Book, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUBJECTS } from '../constants';
import { Topic, Chapter, SubjectModule } from '../types';

interface SearchResult {
  type: 'topic' | 'chapter';
  title: string;
  description: string;
  subject: SubjectModule;
  item: Topic | Chapter;
}

export const SearchPortal: React.FC<{ onClose: () => void; onSelectTopic: (s: SubjectModule, t: Topic) => void }> = ({ onClose, onSelectTopic }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];

    const found: SearchResult[] = [];
    const q = query.toLowerCase();

    SUBJECTS.forEach(subject => {
      const allChapters = [...subject.class11, ...subject.class12];
      
      allChapters.forEach(chapter => {
        if (chapter.title.toLowerCase().includes(q) || chapter.description.toLowerCase().includes(q)) {
          found.push({ type: 'chapter', title: chapter.title, description: chapter.description, subject, item: chapter });
        }

        chapter.topics.forEach(topic => {
          if (topic.title.toLowerCase().includes(q) || topic.description.toLowerCase().includes(q) || topic.content.toLowerCase().includes(q)) {
            found.push({ type: 'topic', title: topic.title, description: topic.description, subject, item: topic });
          }
        });
      });
    });

    return found.slice(0, 8); // Limit results
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl p-4 pt-40 md:p-8 md:pt-40"
    >
      <div className="max-w-3xl mx-auto w-full">
        <div className="relative group mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30 group-focus-within:text-orange-500 transition-colors" />
          <input
            autoFocus
            type="text"
            placeholder="Search topics, chapters, or concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-white/20"
          />
          <button 
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? results.map((result, i) => (
              <motion.button
                key={`${result.type}-${result.title}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  if (result.type === 'topic') {
                    onSelectTopic(result.subject, result.item as Topic);
                    onClose();
                  }
                }}
                className="w-full text-left p-6 glass border-white/5 rounded-[2.5rem] hover:bg-white/5 transition-all flex items-center gap-6 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${result.type === 'topic' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {result.type === 'topic' ? <Sparkles className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">{result.subject.code}</span>
                    <span className={`text-[10px] uppercase font-black tracking-widest ${result.type === 'topic' ? 'text-orange-500' : 'text-blue-500'}`}>{result.type}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 truncate group-hover:text-orange-500 transition-colors">{result.title}</h4>
                  <p className="text-sm text-white/40 line-clamp-1">{result.description}</p>
                </div>

                <ChevronRight className="w-5 h-5 text-white/20 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )) : query.length > 1 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-30">
                <Search className="w-12 h-12 mx-auto mb-4" />
                <p className="text-xl font-serif">No matches found for "{query}"</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
