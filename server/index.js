const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const aiRoutes = require('./routes/aiRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(mongoSanitize());

// Rate Limiting
app.use('/api', apiLimiter);

// Connect Database
connectDB();

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nova AI Backend API</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2rem 3rem; border-radius: 1rem; border: 1px solid #334155; text-align: center; max-width: 500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          h1 { color: #38bdf8; margin-bottom: 0.5rem; }
          p { color: #94a3b8; line-height: 1.6; }
          .status { display: inline-block; background: #059669; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; }
          a { color: #38bdf8; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status">🟢 Server Online</div>
          <h1>Nova AI Chatbot Backend</h1>
          <p>This is the REST API backend server for Nova AI. The frontend React UI connects to this server to process chat requests.</p>
          <p><a href="/api/health" target="_blank">Check API Health (/api/health)</a></p>
        </div>
      </body>
    </html>
  `);
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Nova AI Chatbot Server',
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.io Real-Time Events
io.on('connection', (socket) => {
  console.log(` Socket Connected: ${socket.id}`);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat: ${chatId}`);
  });

  socket.on('user_typing', ({ chatId, userName }) => {
    socket.to(chatId).emit('assistant_typing', { chatId, userName });
  });

  socket.on('disconnect', () => {
    console.log(` Socket Disconnected: ${socket.id}`);
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  ======================================================
     NOVA AI CHATBOT BACKEND RUNNING 🚀
     Server Port : ${PORT}
     Environment : ${process.env.NODE_ENV || 'development'}
     Health Check: http://localhost:${PORT}/api/health
  ======================================================
  `);
});
