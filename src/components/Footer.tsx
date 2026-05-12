import { TrendingUp, Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#030303] border-t border-white/5 pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-white/90">Commerce Assistant</h1>
            </div>
            <p className="text-white/40 text-sm leading-relaxed italic">
              Empowering the next generation of business leaders with AI-driven pedagogical tools and comprehensive digital textbooks.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-orange-500/10 hover:border-orange-500/20 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-orange-500 mb-8">Curriculum</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Accountancy', 'Economics', 'Business Studies', 'Applied Math'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors flex items-center justify-between group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-blue-500 mb-8">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['AI Masterclasses', 'Digital Vault', 'Exam Strategies', 'Case Studies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/40 hover:text-white transition-colors flex items-center justify-between group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-500 mb-8">Connect</h4>
            <div className="space-y-6">
              <p className="text-sm text-white/40 leading-relaxed">
                Subscribe to our educational newsletter for weekly commerce insights.
              </p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 rounded-lg text-white">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
            © {currentYear} TradeWise AI. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
