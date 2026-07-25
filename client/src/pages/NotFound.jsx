import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Bot className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight text-white">404</h1>
        <p className="text-lg text-slate-400 max-w-md">
          Oops! The page or conversation step you are looking for does not exist in Nova AI.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
