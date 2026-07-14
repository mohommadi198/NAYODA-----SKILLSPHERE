require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const User = require('./models/User');
const registerChatSocket = require('./socket/chatSocket');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/users', require('./routes/usersRouter'));
app.use('/api/proposals', require('./routes/proposalRouter'));
app.use('/api/jobs', require('./routes/jobsRouter'));
app.use('/api/chat', require('./routes/chatRouter'));

// Test Route
app.get('/', (req, res) => res.send('SkillSphere API is running...'));

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Map of userId -> Set of socket ids (a user can have multiple tabs/devices)
const onlineUsers = new Map();

// Authenticate socket connections using the same JWT the REST API uses
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: no token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error: user not found'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user._id.toString();

  // Register this socket under the user
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socket.id);

  // Notify everyone that this user is now online
  socket.broadcast.emit('user:online', { userId });

  // Join a room named after the user so we can target them directly
  socket.join(`user:${userId}`);

  registerChatSocket(io, socket, { onlineUsers });

  socket.on('disconnect', () => {
    const sockets = onlineUsers.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        // Tell others this user went offline
        socket.broadcast.emit('user:offline', { userId });
      }
    }
  });
});

// Expose helper so other modules can check online status
app.set('onlineUsers', onlineUsers);
app.set('io', io);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
