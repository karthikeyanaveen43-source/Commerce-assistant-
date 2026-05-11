import { TrendingUp, Search, GraduationCap } from 'lucide-react';

export const Navbar = ({ onHome, onSearch, onOpenTutor }: { onHome: () => void; onSearch: () => void; onOpenTutor?: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center bg-black/20 backdrop-blur-md">
    <div 
      className="flex items-center gap-2 cursor-pointer group"
      onClick={onHome}
    >
      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 group-hover:glow transition-all duration-300">
        <TrendingUp className="w-6 h-6 text-orange-500" />
      </div>
      <h1 className="text-xl font-serif font-bold tracking-tight text-white/90">Commerce Assistant</h1>
    </div>
    
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
      <button onClick={onHome} className="hover:text-white transition-colors">Explorer</button>
      <button className="hover:text-white transition-colors">Library</button>
      <button onClick={onOpenTutor} className="px-4 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 border border-orange-500/20">
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
