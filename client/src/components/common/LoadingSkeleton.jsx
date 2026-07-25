import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full p-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="w-9 h-9 rounded-xl bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/4" />
            <div className="h-3 bg-slate-800/60 rounded w-3/4" />
            <div className="h-3 bg-slate-800/40 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
