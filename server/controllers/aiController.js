const { getModel } = require('../config/gemini');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const { getIsInMemory } = require('../config/db');
const mockStore = require('../utils/mockStore');
const axios = require('axios');

// Helper to fetch image buffer for Gemini multimodal input
async function fetchImagePart(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const mimeType = response.headers['content-type'] || 'image/jpeg';
    return {
      inlineData: {
        data: Buffer.from(response.data).toString('base64'),
        mimeType,
      },
    };
  } catch (err) {
    console.warn('Failed to fetch image for Gemini vision input:', err.message);
    return null;
  }
}

// Clean and format Gemini history array to strictly satisfy Google Gemini's requirements:
// 1. History MUST start with role 'user' (never 'model')
// 2. Roles MUST alternate between 'user' and 'model'
function formatGeminiHistory(rawMsgs) {
  if (!rawMsgs || rawMsgs.length === 0) return [];

  let formatted = rawMsgs
    .filter((m) => m && m.content && String(m.content).trim() !== '')
    .map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.content) }],
    }));

  // Drop leading 'model' messages until the first message has role 'user'
  while (formatted.length > 0 && formatted[0].role !== 'user') {
    formatted.shift();
  }

  // Ensure alternating user/model pattern
  const cleanHistory = [];
  for (const item of formatted) {
    if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== item.role) {
      cleanHistory.push(item);
    }
  }

  return cleanHistory;
}

// @desc    Send message & stream AI response (SSE)
// @route   POST /api/ai/chat
// @access  Private
const streamChatResponse = async (req, res, next) => {
  try {
    const { chatId, message: userContent, images = [], modelName = 'gemini-flash-latest' } = req.body;
    const userId = req.user._id;

    if (!chatId || !userContent) {
      return res.status(400).json({ success: false, message: 'Chat ID and message content are required' });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 1. Save user message
    let userMsgObj;
    let chatObj;

    if (getIsInMemory()) {
      chatObj = mockStore.chats.find((c) => String(c._id) === String(chatId));
      if (!chatObj) {
        chatObj = {
          _id: chatId,
          userId: String(userId),
          title: userContent.slice(0, 30) + '...',
          isPinned: false,
          isFavorite: false,
          modelUsed: modelName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockStore.chats.unshift(chatObj);
      } else if (chatObj.title === 'New Conversation') {
        chatObj.title = userContent.slice(0, 30) + (userContent.length > 30 ? '...' : '');
      }
      chatObj.updatedAt = new Date();

      userMsgObj = {
        _id: `msg_${Date.now()}_u`,
        chatId: String(chatId),
        role: 'user',
        content: userContent,
        images,
        isEdited: false,
        createdAt: new Date(),
      };
      mockStore.messages.push(userMsgObj);
    } else {
      chatObj = await Chat.findOne({ _id: chatId, userId });
      if (!chatObj) {
        res.write(`data: ${JSON.stringify({ error: 'Chat not found' })}\n\n`);
        return res.end();
      }

      if (chatObj.title === 'New Conversation') {
        chatObj.title = userContent.slice(0, 32) + (userContent.length > 32 ? '...' : '');
        await chatObj.save();
      }

      userMsgObj = await Message.create({
        chatId,
        role: 'user',
        content: userContent,
        images,
      });
    }

    // Emit user message saved confirmation
    res.write(`data: ${JSON.stringify({ type: 'user_message', message: userMsgObj, chatTitle: chatObj.title })}\n\n`);

    // 2. Prepare Gemini Model
    const geminiModel = getModel(modelName) || getModel('gemini-flash-latest');

    let fullAssistantResponse = '';

    if (geminiModel) {
      try {
        // Fetch chat history
        let rawPastMsgs = [];
        if (getIsInMemory()) {
          rawPastMsgs = mockStore.messages.filter((m) => String(m.chatId) === String(chatId));
        } else {
          rawPastMsgs = await Message.find({ chatId }).sort({ createdAt: 1 }).limit(12);
        }

        // Format history cleanly for Google Gemini SDK
        const formattedHistory = formatGeminiHistory(rawPastMsgs);

        // Exclude the current message (which is sent via sendMessageStream)
        const historyForSession = formattedHistory.slice(0, -1);

        // Multimodal image parts setup
        const promptParts = [{ text: userContent }];
        if (images && images.length > 0) {
          for (const img of images) {
            if (img.url) {
              const part = await fetchImagePart(img.url);
              if (part) promptParts.push(part);
            }
          }
        }

        // Send streaming request
        const chatSession = geminiModel.startChat({
          history: historyForSession,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        });

        let resultStream;
        try {
          resultStream = await chatSession.sendMessageStream(promptParts);
        } catch (streamErr) {
          if (streamErr.message && (streamErr.message.includes('404') || streamErr.message.includes('not found'))) {
            const fallbackModel = getModel('gemini-flash-latest');
            if (fallbackModel) {
              const fallbackSession = fallbackModel.startChat({
                history: historyForSession,
                generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
              });
              resultStream = await fallbackSession.sendMessageStream(promptParts);
            } else {
              throw streamErr;
            }
          } else {
            throw streamErr;
          }
        }

        for await (const chunk of resultStream.stream) {
          const textChunk = chunk.text();
          if (textChunk) {
            fullAssistantResponse += textChunk;
            res.write(`data: ${JSON.stringify({ type: 'chunk', text: textChunk })}\n\n`);
          }
        }
      } catch (err) {
        console.warn('Gemini Stream Error:', err.message);

        if (err.message.includes('429') || err.message.includes('Quota exceeded')) {
          fullAssistantResponse = `⚠️ **Google Gemini API Quota Exceeded (HTTP 429)**\n\n` +
            `Your Google AI Studio free tier quota limit was reached. Please wait ~60 seconds before sending another message.`;
        } else if (err.message.includes('404') || err.message.includes('not found')) {
          fullAssistantResponse = `⚠️ **Invalid API Key or Model Error (HTTP 404)**\n\n` +
            `Please check that your \`GEMINI_API_KEY\` in \`server/.env\` is a valid key copied from [Google AI Studio](https://aistudio.google.com/).`;
        } else {
          fullAssistantResponse = `[Gemini Notice]: ${err.message}`;
        }
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: fullAssistantResponse })}\n\n`);
      }
    } else {
      // Demo Mode response generator when GEMINI_API_KEY is missing or invalid
      let mockAnswer = '';
      const promptLower = userContent.toLowerCase().trim();

      if (promptLower === 'yes' || promptLower === 'ok' || promptLower === 'sure') {
        mockAnswer = `Great! I'm ready to assist you. Feel free to ask any question, paste code, or request help with your project!`;
      } else if (promptLower.includes('temp') || promptLower.includes('database')) {
        mockAnswer = `A **Database** is an organized collection of structured information or data stored electronically in a computer system.\n\nKey Concepts:\n1. **MongoDB**: A NoSQL document database that stores data in JSON-like documents.\n2. **SQL (PostgreSQL / MySQL)**: Relational databases using tables with rows and columns.\n3. **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.`;
      } else {
        mockAnswer = `Hello! I received your query: "${userContent}".\n\n*(Note: Running in Nova AI Demo Mode. To activate real Gemini AI responses, paste your API Key from [Google AI Studio](https://aistudio.google.com/) into \`server/.env\` and restart the backend server).*`;
      }

      const words = mockAnswer.split(' ');
      for (const word of words) {
        const textChunk = word + ' ';
        fullAssistantResponse += textChunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: textChunk })}\n\n`);
        await new Promise((r) => setTimeout(r, 30));
      }
    }

    // 3. Save assistant message to database/mockStore
    let assistantMsgObj;
    if (getIsInMemory()) {
      assistantMsgObj = {
        _id: `msg_${Date.now()}_a`,
        chatId: String(chatId),
        role: 'assistant',
        content: fullAssistantResponse,
        images: [],
        isEdited: false,
        createdAt: new Date(),
      };
      mockStore.messages.push(assistantMsgObj);
    } else {
      assistantMsgObj = await Message.create({
        chatId,
        role: 'assistant',
        content: fullAssistantResponse,
      });
    }

    res.write(`data: ${JSON.stringify({ type: 'done', message: assistantMsgObj })}\n\n`);
    res.end();
  } catch (error) {
    console.error('streamChatResponse error:', error);
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
};

module.exports = {
  streamChatResponse,
};
