import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Pin,
  Star,
  Trash2,
  Edit2,
  Search,
  Check,
  X,
  User,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const {
    chats,
    currentChat,
    createNewChat,
    selectChat,
    deleteChat,
    togglePin,
    toggleFavorite,
    renameChat,
    isSidebarOpen,
    setIsSidebarOpen,
    searchQuery,
    setSearchQuery,
    fetchChats,
  } = useChat();

  const { user, logout } = useAuth();
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (chat) => {
    setEditingChatId(chat._id);
    setEditingTitle(chat.title);
  };

  const handleSaveRename = (chatId) => {
    if (editingTitle.trim()) {
      renameChat(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchChats(val);
  };

  const pinnedChats = chats.filter((c) => c.isPinned);
  const otherChats = chats.filter((c) => !c.isPinned);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 flex flex-col w-72 bg-[#0d1117] border-r border-slate-800/80 transition-all duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-72'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-4 space-y-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-100">Nova AI</span>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => createNewChat()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Chat History Lists */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin">
          {/* Pinned Section */}
          {pinnedChats.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <Pin className="w-3 h-3 text-indigo-400" />
                <span>Pinned Chats</span>
              </div>
              <div className="space-y-1">
                {pinnedChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={currentChat?._id === chat._id}
                    onSelect={() => selectChat(chat._id)}
                    onDelete={() => deleteChat(chat._id)}
                    onTogglePin={() => togglePin(chat._id)}
                    onToggleFav={() => toggleFavorite(chat._id)}
                    isEditing={editingChatId === chat._id}
                    editingTitle={editingTitle}
                    setEditingTitle={setEditingTitle}
                    onStartRename={() => handleStartRename(chat)}
                    onSaveRename={() => handleSaveRename(chat._id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent History Section */}
          <div>
            <div className="flex items-center gap-1.5 px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span>Recent Conversations</span>
            </div>

            {otherChats.length === 0 ? (
              <p className="px-2 text-xs text-slate-500 italic py-2">No previous chats found.</p>
            ) : (
              <div className="space-y-1">
                {otherChats.map((chat) => (
                  <ChatItem
                    key={chat._id}
                    chat={chat}
                    isActive={currentChat?._id === chat._id}
                    onSelect={() => selectChat(chat._id)}
                    onDelete={() => deleteChat(chat._id)}
                    onTogglePin={() => togglePin(chat._id)}
                    onToggleFav={() => toggleFavorite(chat._id)}
                    isEditing={editingChatId === chat._id}
                    editingTitle={editingTitle}
                    setEditingTitle={setEditingTitle}
                    onStartRename={() => handleStartRename(chat)}
                    onSaveRename={() => handleSaveRename(chat._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
            <Link to="/profile" className="flex items-center gap-3 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <Link to="/settings" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <Settings className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const ChatItem = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
  onToggleFav,
  isEditing,
  editingTitle,
  setEditingTitle,
  onStartRename,
  onSaveRename,
}) => {
  return (
    <div
      className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
        isActive
          ? 'bg-indigo-600/15 border border-indigo-500/30 text-slate-100 font-medium'
          : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full bg-slate-900 border border-indigo-500 text-slate-100 text-xs px-2 py-1 rounded focus:outline-none"
              autoFocus
            />
            <button onClick={onSaveRename} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-xs truncate">{chat.title}</span>
        )}
      </div>

      {!isEditing && (
        <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onTogglePin}
            className={`p-1 rounded hover:bg-slate-700 ${chat.isPinned ? 'text-indigo-400' : 'text-slate-500'}`}
            title={chat.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="w-3 h-3" />
          </button>
          <button
            onClick={onToggleFav}
            className={`p-1 rounded hover:bg-slate-700 ${chat.isFavorite ? 'text-amber-400' : 'text-slate-500'}`}
            title={chat.isFavorite ? 'Remove Favorite' : 'Favorite'}
          >
            <Star className="w-3 h-3 fill-current" />
          </button>
          <button
            onClick={onStartRename}
            className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-slate-200"
            title="Rename"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-rose-400"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
