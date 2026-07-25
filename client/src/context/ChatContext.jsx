import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const abortControllerRef = useRef(null);

  // Fetch chats on authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats();
    } else {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
    }
  }, [isAuthenticated]);

  const fetchChats = async (query = searchQuery) => {
    try {
      setLoadingChats(true);
      const res = await chatAPI.getChats(query);
      if (res.success) {
        setChats(res.chats);
        if (!currentChat && res.chats.length > 0) {
          selectChat(res.chats[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching chats:', err.message);
    } finally {
      setLoadingChats(false);
    }
  };

  const selectChat = async (chatId) => {
    try {
      setLoadingMessages(true);
      const res = await chatAPI.getChatById(chatId);
      if (res.success) {
        setCurrentChat(res.chat);
        setMessages(res.messages);
      }
    } catch (err) {
      console.error('Error selecting chat:', err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createNewChat = async (initialTitle = 'New Conversation') => {
    try {
      const res = await chatAPI.createChat({ title: initialTitle, modelUsed: selectedModel });
      if (res.success) {
        setChats((prev) => [res.chat, ...prev]);
        setCurrentChat(res.chat);
        setMessages([]);
        return res.chat;
      }
    } catch (err) {
      console.error('Error creating chat:', err.message);
    }
    return null;
  };

  const sendMessage = async (userPrompt, attachedImages = []) => {
    if (!userPrompt.trim() && attachedImages.length === 0) return;

    let activeChat = currentChat;
    if (!activeChat) {
      activeChat = await createNewChat(userPrompt.slice(0, 30));
      if (!activeChat) return;
    }

    const tempUserMsg = {
      _id: `temp_u_${Date.now()}`,
      chatId: activeChat._id,
      role: 'user',
      content: userPrompt,
      images: attachedImages,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsStreaming(true);
    setStreamingContent('');

    abortControllerRef.current = new AbortController();

    const token = localStorage.getItem('nova_token');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: activeChat._id,
          message: userPrompt,
          images: attachedImages,
          modelName: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let currentStreamText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', '').trim());

              if (data.type === 'user_message') {
                // Update chat title if changed
                if (data.chatTitle && activeChat.title === 'New Conversation') {
                  setCurrentChat((prev) => ({ ...prev, title: data.chatTitle }));
                  setChats((prev) =>
                    prev.map((c) => (c._id === activeChat._id ? { ...c, title: data.chatTitle } : c))
                  );
                }
              } else if (data.type === 'chunk') {
                currentStreamText += data.text;
                setStreamingContent(currentStreamText);
              } else if (data.type === 'done') {
                setMessages((prev) => [...prev, data.message]);
                setIsStreaming(false);
                setStreamingContent('');
              }
            } catch (e) {
              // Parse partial JSON silently
            }
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Stream generation aborted by user.');
        if (streamingContent) {
          setMessages((prev) => [
            ...prev,
            {
              _id: `temp_a_${Date.now()}`,
              chatId: activeChat._id,
              role: 'assistant',
              content: streamingContent + ' [Stopped by user]',
              createdAt: new Date(),
            },
          ]);
        }
      } else {
        console.error('Error sending message:', err.message);
        setMessages((prev) => [
          ...prev,
          {
            _id: `err_${Date.now()}`,
            chatId: activeChat._id,
            role: 'assistant',
            content: `⚠️ Error: Could not connect to AI service (${err.message}). Please check backend status.`,
            createdAt: new Date(),
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  };

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const res = await chatAPI.deleteChat(chatId);
      if (res.success) {
        setChats((prev) => prev.filter((c) => c._id !== chatId));
        if (currentChat && currentChat._id === chatId) {
          const remaining = chats.filter((c) => c._id !== chatId);
          if (remaining.length > 0) {
            selectChat(remaining[0]._id);
          } else {
            setCurrentChat(null);
            setMessages([]);
          }
        }
      }
    } catch (err) {
      console.error('Error deleting chat:', err.message);
    }
  };

  const togglePin = async (chatId) => {
    try {
      const res = await chatAPI.togglePin(chatId);
      if (res.success) {
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, isPinned: res.chat.isPinned } : c))
        );
        if (currentChat && currentChat._id === chatId) {
          setCurrentChat((prev) => ({ ...prev, isPinned: res.chat.isPinned }));
        }
      }
    } catch (err) {
      console.error('Error toggling pin:', err.message);
    }
  };

  const toggleFavorite = async (chatId) => {
    try {
      const res = await chatAPI.toggleFavorite(chatId);
      if (res.success) {
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, isFavorite: res.chat.isFavorite } : c))
        );
        if (currentChat && currentChat._id === chatId) {
          setCurrentChat((prev) => ({ ...prev, isFavorite: res.chat.isFavorite }));
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err.message);
    }
  };

  const renameChat = async (chatId, newTitle) => {
    try {
      const res = await chatAPI.updateTitle(chatId, newTitle);
      if (res.success) {
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, title: res.chat.title } : c))
        );
        if (currentChat && currentChat._id === chatId) {
          setCurrentChat((prev) => ({ ...prev, title: res.chat.title }));
        }
      }
    } catch (err) {
      console.error('Error renaming chat:', err.message);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        loadingChats,
        loadingMessages,
        isStreaming,
        streamingContent,
        selectedModel,
        setSelectedModel,
        searchQuery,
        setSearchQuery,
        isSidebarOpen,
        setIsSidebarOpen,
        fetchChats,
        selectChat,
        createNewChat,
        sendMessage,
        stopGenerating,
        deleteChat,
        togglePin,
        toggleFavorite,
        renameChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
