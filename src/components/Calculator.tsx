import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, Equal, RefreshCw } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'si' | 'ratio'>('si');
  
  // SI State
  const [p, setP] = useState('');
  const [r, setR] = useState('');
  const [t, setT] = useState('');
  const [siResult, setSiResult] = useState<number | null>(null);

  // Ratio State
  const [ca, setCa] = useState('');
  const [cl, setCl] = useState('');
  const [ratioResult, setRatioResult] = useState<number | null>(null);

  const calculateSI = () => {
    const res = (parseFloat(p) * parseFloat(r) * parseFloat(t)) / 100;
    setSiResult(res);
  };

  const calculateRatio = () => {
    const res = parseFloat(ca) / parseFloat(cl);
    setRatioResult(res);
  };

  const reset = () => {
    setP(''); setR(''); setT(''); setSiResult(null);
    setCa(''); setCl(''); setRatioResult(null);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 mb-8 max-w-sm mx-auto">
        <button 
          onClick={() => {setActiveTab('si'); reset();}}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === 'si' ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'}`}
        >
          Simple Interest
        </button>
        <button 
          onClick={() => {setActiveTab('ratio'); reset();}}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${activeTab === 'ratio' ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'}`}
        >
          Current Ratio
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {activeTab === 'si' ? (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Principal Amount (P)</label>
              <input 
                type="number" value={p} onChange={e => setP(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-colors"
                placeholder="Ex: 10000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Rate (%) (R)</label>
                <input 
                  type="number" value={r} onChange={e => setR(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-colors"
                  placeholder="Ex: 5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Time (Years) (T)</label>
                <input 
                  type="number" value={t} onChange={e => setT(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-colors"
                  placeholder="Ex: 2"
                />
              </div>
            </div>
            <button 
              onClick={calculateSI}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Equal className="w-4 h-4" /> Calculate SI
            </button>
            
            {siResult !== null && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 glass border-orange-500/20 rounded-2xl text-center">
                <p className="text-white/40 text-xs mb-1">Total Simple Interest</p>
                <p className="text-4xl font-serif font-black text-orange-500">₹{siResult.toLocaleString()}</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Current Assets</label>
              <input 
                type="number" value={ca} onChange={e => setCa(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-colors"
                placeholder="Ex: 50000"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Current Liabilities</label>
              <input 
                type="number" value={cl} onChange={e => setCl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 transition-colors"
                placeholder="Ex: 25000"
              />
            </div>
            <button 
              onClick={calculateRatio}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
            >
              <CalcIcon className="w-4 h-4" /> Calculate Ratio
            </button>
            
            {ratioResult !== null && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 glass border-orange-500/20 rounded-2xl text-center">
                <p className="text-white/40 text-xs mb-1">Current Ratio</p>
                <p className="text-4xl font-serif font-black text-orange-500">{ratioResult.toFixed(2)} : 1</p>
                <p className="text-[10px] text-white/30 mt-2 italic">Standard Ratio is 2:1</p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
