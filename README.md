#  Nova AI — Production-Grade MERN Stack AI Chatbot Platform

![Nova AI Chatbot](https://img.shields.io/badge/Stack-MERN%20%2B%20Gemini%20AI%20%2B%20ImageKit-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

**Nova AI** is a production-ready, highly responsive, visually stunning Full Stack AI Chatbot platform built using the **MERN Stack (MongoDB, Express.js, React 18, Node.js)** integrated with **Google Gemini AI (1.5 Flash & 2.0 Flash)** for streaming text/code responses, **ImageKit** for image upload & CDN storage, **Socket.io** for real-time state, and **Tailwind CSS + Framer Motion** for a premium glassmorphic dark/light UI.

---

## 🌟 Key Features

### 🔐 Authentication & Security
- **JWT Authentication** with standard authorization header tokens
- **bcrypt Password Hashing** & password encryption
- **User Profile Management** with ImageKit avatar uploader
- **Protected Routes** on both client & server
- **Security Middlewares**: Helmet HTTP security headers, CORS origin protection, Express Rate Limiter, and MongoDB Query Sanitization against NoSQL injection

### 🤖 AI Chat Capabilities
- **ChatGPT / Claude Inspired UI** with responsive drawer sidebar
- **Streaming AI Responses** (Server-Sent Events streaming token typing effect)
- **Multimodal AI Vision**: Attach images via ImageKit and analyze them using Gemini Vision models
- **Rich GFM Markdown**: Code blocks with syntax highlighting & 1-click **Copy Code** button
- **Voice & Speech Tools**: Web Speech API for Speech-to-Text voice prompt input & Text-to-Speech audio reader
- **Chat Management**: Pin favorite chats, rename titles, search conversations, and delete history
- **PDF Export**: Download full formatted conversation transcripts as PDF files

### 🎨 Premium Design System
- Glassmorphism dark mode & light mode toggle with state persistence
- Custom scrollbars, glowing keyframe pulses, and smooth Framer Motion transitions
- Skeleton loaders & empty state starter cards
- Out-of-the-box fallback simulation mode if database/API keys are not set up yet

---

## 📁 Repository Structure

```
mern-ai-chatbot/
├── client/                     # Vite + React 18 + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/        # ChatArea, Sidebar, MessageItem, ChatInput, ModelSelector, CodeBlock
│   │   ├── context/           # AuthContext, ChatContext, ThemeContext, SocketContext
│   │   ├── pages/             # LandingPage, Login, Register, ChatScreen, Profile, Settings, NotFound
│   │   ├── services/          # api.js (Axios instance with JWT interceptors)
│   │   ├── utils/             # exportPdf.js (html2pdf generator)
│   │   ├── App.jsx            # Router setup
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── config/                 # db.js, gemini.js, imagekit.js
│   ├── controllers/            # authController, chatController, aiController, uploadController
│   ├── middleware/             # authMiddleware, errorMiddleware, rateLimiter
│   ├── models/                 # User.js, Chat.js, Message.js
│   ├── routes/                 # authRoutes, chatRoutes, aiRoutes, uploadRoutes
│   ├── utils/                  # jwt.js, mockStore.js
│   ├── index.js                # Express + Socket.io Server Entry Point
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster URI)
- [Google Gemini API Key](https://aistudio.google.com/)
- [ImageKit Account Credentials](https://imagekit.io/)

### 1. Clone & Set Up Backend

```bash
cd server

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Edit `server/.env` with your actual credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/nova_ai_chatbot
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
IMAGEKIT_PUBLIC_KEY=public_your_imagekit_key
IMAGEKIT_PRIVATE_KEY=private_your_imagekit_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

Run the backend server:
```bash
npm run dev
# Backend starts at http://localhost:5000
```

### 2. Set Up Frontend Client

In a new terminal window:
```bash
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Frontend starts at http://localhost:5173
```

---

## 🌐 Deployment Instructions

### 1. Database: MongoDB Atlas
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection string (`mongodb+srv://<username>:<password>@cluster.mongodb.net/nova_ai_chatbot`).
3. Add your deployment platform IP (0.0.0.0/0 for global access) in Network Access.

### 2. Backend: Render / Railway / Heroku
1. Connect your repository to **Render** and choose **Web Service**.
2. Set **Root Directory** to `server`.
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Add Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `CLIENT_URL`).

### 3. Frontend: Vercel / Netlify
1. Connect your repository to **Vercel**.
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Environment Variable: `VITE_API_URL=https://your-backend-render-app.onrender.com/api`
5. Deploy!

---

## 📜 API Endpoints Reference

### Auth Routes (`/api/auth`)
- `POST /register` — Register a new account
- `POST /login` — Authenticate and receive JWT token
- `GET /profile` — Get current user profile (Protected)
- `PUT /profile` — Update user details & avatar (Protected)

### Chat Routes (`/api/chats`)
- `GET /chats` — List user chats with optional `?search=` filter
- `POST /chats` — Create a new conversation
- `GET /chats/:id` — Retrieve chat & message history
- `PUT /chats/:id` — Rename conversation title
- `PATCH /chats/:id/pin` — Toggle pinned status
- `PATCH /chats/:id/favorite` — Toggle favorite status
- `DELETE /chats/:id` — Delete conversation & messages

### AI & Upload Routes (`/api/ai` & `/api/upload`)
- `POST /ai/chat` — Stream Gemini AI response tokens via SSE (Supports text + image input)
- `GET /upload/imagekit-auth` — Get client side ImageKit signature & token
- `POST /upload/image` — Backend proxy upload to ImageKit CDN

---

## 📄 License
Distributed under the MIT License. Built for software engineering portfolios.
