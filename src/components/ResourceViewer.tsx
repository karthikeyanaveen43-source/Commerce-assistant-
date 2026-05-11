import React from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Download, ShieldAlert } from 'lucide-react';

interface ResourceViewerProps {
  title: string;
  url: string;
  onClose: () => void;
}

export const ResourceViewer: React.FC<ResourceViewerProps> = ({ title, url, onClose }) => {
  const isZip = url.endsWith('.zip');
  
  // Try to determine if we can reasonably iframe this
  const canIframe = !isZip && (url.includes('diksha.gov.in') || url.includes('ncert.nic.in/textbook.php'));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-12"
    >
      <div className="relative w-full h-full max-w-6xl glass border-white/10 rounded-[3rem] overflow-hidden flex flex-col">
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
               <ExternalLink className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">{title}</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Official Learning Resource</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" /> Open Outside
            </a>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 bg-white/[0.02] relative">
          {canIframe ? (
            <iframe 
              src={url} 
              className="w-full h-full border-none"
              title={title}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
               <div className="w-24 h-24 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8">
                  {isZip ? <Download className="w-10 h-10 text-orange-500" /> : <ShieldAlert className="w-10 h-10 text-orange-500" />}
               </div>
               <h4 className="text-3xl font-serif font-bold mb-4">
                 {isZip ? "Resource Package Detected" : "Browser Security Restrictions"}
               </h4>
               <p className="text-white/50 max-w-lg mb-10 leading-relaxed">
                 {isZip 
                   ? "This textbook is a complete collection in a compressed ZIP format. To maintain performance and security, please download and open the PDF files directly on your device." 
                   : "Some official portals prevent their content from being displayed within other apps for security. You can open this resource in a new secure window."}
               </p>
               <a 
                 href={url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-3 transform hover:scale-105"
               >
                 {isZip ? <Download className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
                 {isZip ? "Download Textbook Collection" : "Open Resource in New Tab"}
               </a>
               <p className="mt-8 text-[10px] text-white/20 uppercase tracking-widest font-bold">
                 Managed by {url.includes('ncert') ? 'NCERT' : 'MHRD / Diksha'}
               </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
