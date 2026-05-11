import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { price: 10, demand: 100, supply: 20 },
  { price: 20, demand: 80, supply: 40 },
  { price: 30, demand: 60, supply: 60 },
  { price: 40, demand: 40, supply: 80 },
  { price: 50, demand: 20, supply: 100 },
];

export const EconomyGraph: React.FC = () => {
  return (
    <div className="w-full h-[400px] p-4 glass rounded-3xl overflow-hidden mt-6">
      <h4 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6 px-4">Market Equilibrium Graph</h4>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="price" 
            stroke="#ffffff40" 
            fontSize={10} 
            label={{ value: 'Price (₹)', position: 'insideBottom', offset: -5, fill: '#ffffff60', fontSize: 10 }} 
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={10} 
            label={{ value: 'Quantity', angle: -90, position: 'insideLeft', fill: '#ffffff60', fontSize: 10 }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px' }}
            itemStyle={{ fontSize: '10px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="demand" 
            stroke="#f27d26" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#f27d26' }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="supply" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-white/20 text-center italic mt-2">Intersection point represents Equilibrium Price & Quantity</p>
    </div>
  );
};
