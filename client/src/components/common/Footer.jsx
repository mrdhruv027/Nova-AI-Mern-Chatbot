import React from 'react';
import { Bot, Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#080B11] border-t border-slate-800/80 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Nova AI Chatbot Platform</span>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using MERN Stack, Google Gemini AI & ImageKit
        </p>

        <div className="flex items-center gap-4 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            v2.4.0 Production Ready
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
