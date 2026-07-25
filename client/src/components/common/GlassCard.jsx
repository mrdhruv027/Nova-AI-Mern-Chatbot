import React from 'react';

const GlassCard = ({ children, className = '', hover = true }) => {
  return (
    <div
      className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl ${
        hover ? 'hover:border-indigo-500/30 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
