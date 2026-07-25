import React, { useRef, useEffect } from 'react';
import { Bot, Sparkles, Download, Menu, Share2, Code, Image as ImageIcon, Lightbulb, Compass } from 'lucide-react';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { useChat } from '../../context/ChatContext';
import { exportChatToPdf } from '../../utils/exportPdf';

const ChatArea = () => {
  const {
    currentChat,
    messages,
    loadingMessages,
    isStreaming,
    streamingContent,
    sendMessage,
    stopGenerating,
    setIsSidebarOpen,
  } = useChat();

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update or streaming content arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isStreaming]);

  const handleExport = () => {
    if (!messages || messages.length === 0) return;
    exportChatToPdf(currentChat?.title || 'Nova AI Conversation', messages);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Chat link copied to clipboard!');
  };

  const promptSuggestions = [
    {
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      title: 'Write Code & Refactor',
      prompt: 'Write a Node.js Express route with JWT authentication and Mongoose model validation.',
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-purple-400" />,
      title: 'Multimodal Vision Analysis',
      prompt: 'Attach an image and ask: Explain what is shown in this image and describe its UI components.',
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
      title: 'Brainstorm Startup Ideas',
      prompt: 'Give me 5 unique AI SaaS product ideas targeting developer productivity in 2026.',
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      title: 'System Architecture',
      prompt: 'Explain the difference between WebSockets, SSE, and HTTP Polling in real-time chat applications.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F17] overflow-hidden relative">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-900/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-100 truncate">
              {currentChat?.title || 'New Conversation'}
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Model Selector & Action Tools */}
        <div className="flex items-center gap-2">
          <ModelSelector />

          {messages.length > 0 && (
            <>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Share Chat Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-medium hover:border-indigo-500/50 transition-all shadow-md"
                title="Export as PDF"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
        {loadingMessages ? (
          <LoadingSkeleton count={4} />
        ) : messages.length === 0 ? (
          /* Empty State View */
          <div className="h-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-12 px-4 space-y-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-2xl shadow-indigo-500/30 animate-pulse">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                How can <span className="gradient-text">Nova AI</span> assist you today?
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Powered by Google Gemini AI, ImageKit image analysis, real-time code execution, and Markdown synthesis.
              </p>
            </div>

            {/* Starter Suggestion Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
              {promptSuggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(item.prompt)}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-300 group shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-slate-800/80 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-xs text-slate-200">{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation Message Bubbles */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <MessageItem
                key={msg._id || idx}
                message={msg}
                onRegenerate={() => {
                  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
                  if (lastUserMsg) sendMessage(lastUserMsg.content, lastUserMsg.images);
                }}
                onEdit={(newPrompt) => sendMessage(newPrompt)}
              />
            ))}

            {/* Live Streaming AI Response Bubble */}
            {isStreaming && (
              <MessageItem
                message={{
                  role: 'assistant',
                  content: streamingContent || '...',
                  createdAt: new Date(),
                }}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <ChatInput onSend={sendMessage} isStreaming={isStreaming} onStop={stopGenerating} />
    </div>
  );
};

export default ChatArea;
