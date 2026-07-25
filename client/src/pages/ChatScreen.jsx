import React from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';

const ChatScreen = () => {
  return (
    <div className="h-screen w-screen bg-[#0B0F17] flex overflow-hidden">
      <Sidebar />
      <ChatArea />
    </div>
  );
};

export default ChatScreen;
