import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, Volume2, VolumeX, Edit3, RefreshCw } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { useAuth } from '../../context/AuthContext';

const MessageItem = ({ message, onRegenerate, onEdit }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-4 py-5 px-4 md:px-6 rounded-2xl transition-colors ${
        isUser
          ? 'bg-slate-800/40 border border-slate-800/60 ml-auto max-w-[85%] md:max-w-[75%]'
          : 'bg-slate-900/80 border border-slate-800/90 w-full'
      }`}
    >
      {/* Avatar Icon */}
      <div className="shrink-0">
        {isUser ? (
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User"
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Message Content Body */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-200">
              {isUser ? user?.name || 'You' : 'Nova AI'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleSpeak}
              className={`p-1 rounded-lg hover:bg-slate-800 transition-colors ${
                speaking ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Text to Speech"
            >
              {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {isUser && onEdit && (
              <button
                onClick={() => onEdit(message.content)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Edit message prompt"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Regenerate response"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Uploaded Images Preview Cards */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.images.map((img, i) => (
              <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={img.url}
                  alt={`Attachment ${i + 1}`}
                  className="w-24 h-24 object-cover rounded-xl border border-slate-700/80 hover:scale-105 transition-transform shadow-md"
                />
              </a>
            ))}
          </div>
        )}

        {/* Markdown Renderer */}
        <div className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                ) : (
                  <code className="bg-slate-800/90 text-indigo-300 font-mono text-xs px-1.5 py-0.5 rounded-md border border-slate-700/50" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;
