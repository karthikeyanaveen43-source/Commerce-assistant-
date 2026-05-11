import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ExternalLink, GraduationCap, Link as LinkIcon, Download } from 'lucide-react';

interface ExternalResource {
  title: string;
  url: string;
  type: 'ncert' | 'diksha' | 'other';
  grade: 11 | 12;
}

interface DigitalLibraryProps {
  resources: ExternalResource[];
  activeGrade: 11 | 12;
  onSelectResource: (resource: ExternalResource) => void;
}

const ResourceCard: React.FC<{ resource: ExternalResource; onSelect: () => void }> = ({ resource, onSelect }) => (
  <motion.button
    onClick={onSelect}
    whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
    className="p-6 glass border-white/5 rounded-3xl flex flex-col justify-between group transition-all text-left w-full h-full"
  >
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${resource.type === 'diksha' ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500'}`}>
          {resource.type === 'diksha' ? <GraduationCap className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest bg-white/5 px-2 py-1 rounded-md">
            Grade {resource.grade}
          </span>
        </div>
      </div>
      <h4 className="font-bold text-white group-hover:text-orange-500 transition-colors mb-2 leading-tight">
        {resource.title}
      </h4>
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-4">
        Official {resource.type === 'ncert' ? 'NCERT' : 'Diksha'} Material
      </p>
    </div>
    
    <div className="flex items-center gap-2 text-xs font-bold text-white/60 group-hover:text-white transition-colors">
      {resource.url.endsWith('.zip') ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
      <span>{resource.url.endsWith('.zip') ? 'Open PDF Textbook' : 'Open in Digital Portal'}</span>
    </div>
  </motion.button>
);

export const DigitalLibrary: React.FC<DigitalLibraryProps> = ({ resources, activeGrade, onSelectResource }) => {
  const filteredResources = resources.filter(r => r.grade === activeGrade);
  const ncertResources = filteredResources.filter(r => r.type === 'ncert');
  const dikshaResources = filteredResources.filter(r => r.type === 'diksha');

  return (
    <div className="space-y-12 text-left">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-3xl font-serif font-bold mb-4">Grade {activeGrade} Library</h3>
          <p className="text-white/50 text-sm max-w-2xl">
            Official curriculum resources for Class {activeGrade}. These materials are provided by NCERT and Diksha to support your studies.
          </p>
        </div>
        {resources.length > filteredResources.length && (
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-white/30 mb-1">Catalog Filtered</p>
            <p className="text-xs text-orange-500">Showing Class {activeGrade} items only</p>
          </div>
        )}
      </header>

      {ncertResources.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">Official NCERT Textbooks</h4>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ncertResources.map((res, i) => <ResourceCard key={i} resource={res} onSelect={() => onSelectResource(res)} />)}
          </div>
        </section>
      )}

      {dikshaResources.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">Diksha Learning Collections</h4>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dikshaResources.map((res, i) => <ResourceCard key={i} resource={res} onSelect={() => onSelectResource(res)} />)}
          </div>
        </section>
      )}


      {resources.length === 0 && (
        <div className="p-20 text-center glass border-dashed border-white/10 rounded-[2.5rem] opacity-40">
           <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
           <p className="text-sm italic">No external resources mapped for this subject yet.</p>
        </div>
      )}
    </div>
  );
};
