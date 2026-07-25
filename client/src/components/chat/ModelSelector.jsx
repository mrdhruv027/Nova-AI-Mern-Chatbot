import React from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useChat();

  const models = [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Fast, multimodal & concise' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Complex reasoning & analysis' },
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-200">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-4 font-semibold"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
              {m.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ModelSelector;
