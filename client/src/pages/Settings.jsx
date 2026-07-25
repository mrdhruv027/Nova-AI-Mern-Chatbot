import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GlassCard from '../components/common/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Key, Cpu, Shield, Database } from 'lucide-react';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-8">
        <h1 className="text-3xl font-extrabold text-white">Platform Settings</h1>

        <GlassCard className="space-y-6 border-indigo-500/20">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Appearance & Theme</h2>
              <p className="text-xs text-slate-400">Switch between dark and light color palettes.</p>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-slate-100">AI Service Integration</h2>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>Google Gemini API</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Configured
                </span>
              </div>
              <p className="text-slate-400">
                Model: <code className="text-slate-200">gemini-1.5-flash</code> & <code className="text-slate-200">gemini-2.0-flash</code>. Supports streaming tokens and vision attachments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>ImageKit CDN Storage</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-slate-400">
                Real-time image uploads, thumbnails generation, and CDN delivery.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
