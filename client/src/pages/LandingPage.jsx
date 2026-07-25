import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  Code2,
  Image as ImageIcon,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Database,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GlassCard from '../components/common/GlassCard';

const LandingPage = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-indigo-400" />,
      title: 'Google Gemini AI Powered',
      desc: 'Blazing fast streaming responses powered by Gemini 1.5 & 2.0 Flash models with context-aware history.',
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-purple-400" />,
      title: 'ImageKit Multimodal Vision',
      desc: 'Seamless image upload via ImageKit. Provide images for instant AI vision analysis, code extraction, and OCR.',
    },
    {
      icon: <Code2 className="w-6 h-6 text-pink-400" />,
      title: 'Syntax Highlighted Markdown',
      desc: 'Beautiful code syntax highlighting, copy-to-clipboard buttons, table rendering, and GFM markdown formatting.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'JWT Auth & Security',
      desc: 'Industry-standard authentication with bcrypt password hashing, JWT middleware, rate limiting, and Helmet protection.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Voice & Speech Input',
      desc: 'Integrated Web Speech Speech-to-Text voice transcription and natural Text-to-Speech audio reader.',
    },
    {
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      title: 'Export & Real-Time Sync',
      desc: 'Download chat transcripts as styled PDFs, search through conversation history, pin favorites, and Socket.io sync.',
    },
  ];

  const techStack = [
    'MongoDB Atlas',
    'Express.js',
    'React 18',
    'Node.js',
    'Tailwind CSS',
    'Framer Motion',
    'Google Gemini AI',
    'ImageKit SDK',
    'Socket.io',
    'JWT Auth',
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" />
            <span>MERN Stack Production Portfolio Showcase</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Next-Gen Intelligence with <span className="gradient-text">Nova AI Chatbot</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A full-stack ChatGPT alternative engineered with React, Tailwind CSS, Node.js, Express, MongoDB, ImageKit, and Google Gemini AI streaming.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-base shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              <span>Existing Account</span>
            </Link>
          </motion.div>

          {/* Interactive Mock Interface Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="pt-12 max-w-5xl mx-auto"
          >
            <GlassCard className="p-4 sm:p-6 text-left border-indigo-500/20 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-mono text-slate-300 ml-2">Nova AI Workspace — Gemini 1.5 Flash</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>

              <div className="py-6 space-y-4 font-mono text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-indigo-300">
                  <span className="font-bold text-slate-400">User:</span> Explain how Nova AI handles image uploads with ImageKit and Gemini Vision.
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed">
                  <span className="font-bold text-indigo-400">Nova AI:</span> Nova AI uses <code className="text-pink-400">ImageKit SDK</code> for secure direct image optimization & CDN delivery. Attached images are converted to multimodal parts and analyzed by <code className="text-indigo-400">Google Gemini 1.5 Flash</code> in real time!
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Badges Banner */}
      <section className="py-10 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Enterprise Architecture Tech Stack
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Industry Performance & Production Readiness
          </h2>
          <p className="text-slate-400 text-base">
            Every feature is designed following clean code patterns, modular controllers, reusable components, and secure endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <GlassCard key={index} className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/80 w-fit">{item.icon}</div>
              <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 bg-gradient-to-b from-[#0B0F17] via-indigo-950/20 to-[#0B0F17] border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Ready to experience Nova AI?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Test registration, live Gemini streaming responses, ImageKit attachments, and voice speech commands.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xl shadow-indigo-600/30 transition-all"
          >
            <span>Launch Demo Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
