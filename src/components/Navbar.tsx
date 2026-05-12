import { TrendingUp, Search, GraduationCap } from 'lucide-react';

export const Navbar = ({ onHome, onSearch, onOpenTutor }: { onHome: () => void; onSearch: () => void; onOpenTutor?: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center bg-black/20 backdrop-blur-md">
    <div 
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onHome}
    >
      <div className="w-11 h-11 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 group-hover:glow transition-all duration-500">
        <TrendingUp className="w-6 h-6 text-orange-500" />
      </div>
      <div>
        <h1 className="text-xl font-serif font-black tracking-tight text-white/90">TradeWise</h1>
        <p className="text-[8px] uppercase tracking-[0.4em] font-black text-orange-500">AI Portal</p>
      </div>
    </div>
    
    <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
      <button onClick={onHome} className="hover:text-orange-500 transition-colors">Curriculum</button>
      <button className="hover:text-orange-500 transition-colors">Masterclasses</button>
      <button className="hover:text-orange-500 transition-colors">Resources</button>
      <button onClick={onOpenTutor} className="px-6 py-2 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3 border border-orange-500/20 shadow-lg shadow-orange-500/5">
        <GraduationCap className="w-4 h-4" />
        AI Tutor Hub
      </button>
    </div>

    <div className="flex items-center gap-4">
      <button 
        onClick={onSearch}
        className="p-3 lg:pr-6 rounded-full hover:bg-white/5 transition-all flex items-center gap-3 text-white/50 hover:text-white group border border-transparent hover:border-white/10"
      >
        <Search className="w-5 h-5 text-current" />
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest">Search</span>
          <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded font-sans text-[10px] opacity-50 group-hover:opacity-100 transition-opacity">
            ⌘ K
          </kbd>
        </div>
      </button>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border border-white/20 shadow-lg cursor-pointer" />
    </div>
  </nav>
);
