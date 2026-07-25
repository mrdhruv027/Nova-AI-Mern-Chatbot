// In-memory data store used when MongoDB is offline
const mockStore = {
  users: [
    {
      _id: 'mock_user_1',
      name: 'Dhruv',
      email: 'dhruv@novaai.com',
      password: '$2a$10$wJtK2G5XN4m.HhV0E8l6fO8tT5l7H9y4jR3e2w1q0p9o8n7m6l5k4', // hashed "password123"
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dhruv',
      bio: 'Fullstack AI developer',
      themePreference: 'dark',
      createdAt: new Date(),
    },
  ],
  chats: [
    {
      _id: 'mock_chat_1',
      userId: 'mock_user_1',
      title: 'Welcome to Nova AI Chatbot',
      isPinned: true,
      isFavorite: true,
      modelUsed: 'gemini-1.5-flash',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(),
    },
  ],
  messages: [
    {
      _id: 'mock_msg_1',
      chatId: 'mock_chat_1',
      role: 'assistant',
      content: 'Hello! I am **Nova AI**, your production-ready intelligent assistant powered by Google Gemini AI & ImageKit. How can I assist your workflow today?',
      images: [],
      isEdited: false,
      createdAt: new Date(Date.now() - 3600000),
    },
  ],
};

module.exports = mockStore;
