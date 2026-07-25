const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  if (!apiKey || apiKey.includes('your_google_gemini_api_key') || apiKey.length < 10) {
    return null;
  }
  
  if (!genAI || genAI.apiKey !== apiKey) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
    } catch (err) {
      console.warn(' Failed to initialize GoogleGenerativeAI:', err.message);
      return null;
    }
  }
  return genAI;
};

const getModel = (modelName = 'gemini-flash-latest') => {
  const client = getGeminiClient();
  if (!client) return null;

  // Map legacy/deprecated names to working aliases for free tier keys
  let targetModel = modelName;
  if (modelName === 'gemini-1.5-flash' || modelName === 'gemini-2.0-flash') {
    targetModel = 'gemini-flash-latest';
  }

  try {
    return client.getGenerativeModel({ model: targetModel });
  } catch (err) {
    console.warn(` Failed to get model ${targetModel}:`, err.message);
    return null;
  }
};

module.exports = { getGeminiClient, getModel };
