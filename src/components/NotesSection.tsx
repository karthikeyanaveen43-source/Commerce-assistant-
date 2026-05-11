import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Trash2, FileEdit, CheckCircle2, Loader2 } from 'lucide-react';
import { saveNote, getNote } from '../lib/progressStore';

interface NotesSectionProps {
  topicId: string;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ topicId }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setContent(getNote(topicId));
  }, [topicId]);

  const handleSave = () => {
    setIsSaving(true);
    saveNote(topicId, content);
    
    // Simulate a brief save delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
    }, 500);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your notes for this topic?')) {
      setContent('');
      saveNote(topicId, '');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-white">Study Notes</h4>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Synthesize your learning</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {showSavedToast && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[10px] font-bold uppercase tracking-widest"
              >
                <CheckCircle2 className="w-3 h-3" /> Saved
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={handleClear}
            className="p-2.5 hover:bg-red-500/10 text-white/30 hover:text-red-500 rounded-xl transition-all"
            title="Clear notes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Notes
          </button>
        </div>
      </div>

      <div className="flex-1 relative group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your notes here... What are the key formulas? Important definitions? Your own summaries?"
          className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-orange-500/30 transition-all resize-none custom-scrollbar leading-relaxed"
        />
        <div className="absolute bottom-4 right-6 text-[10px] text-white/20 uppercase tracking-widest pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity">
          Auto-saves to local storage
        </div>
      </div>
    </div>
  );
};
