import React, { useState } from 'react';
import { MessageSquare, Send, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FeedbackModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[350] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
    >
      <div className="w-full max-w-md glass-card p-8 rounded-[3rem] relative border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={handleSubmit}
              className="text-left"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-white mb-2">How's your experience?</h3>
              <p className="text-white/40 mb-8">We're building the best commerce assistant. Your feedback helps us grow.</p>

              <div className="flex gap-2 mb-8 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="group"
                  >
                    <Star 
                      className={`w-8 h-8 transition-all ${rating >= star ? 'text-yellow-500 fill-yellow-500 scale-110' : 'text-white/10 group-hover:text-white/30'}`} 
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts or report a bug..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white min-h-[120px] mb-6 focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
              />

              <button
                type="submit"
                disabled={rating === 0}
                className={`w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${rating === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 active:scale-95'}`}
              >
                <Send className="w-4 h-4" /> Send Feedback
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="thanks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-emerald-500 fill-emerald-500" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-white mb-2">Thank you!</h4>
              <p className="text-white/40">Your feedback has been logged.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
