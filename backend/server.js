const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('module-alias/register');
const ACTIONS = require('@actions');

const authRoutes = require('./routes/authRoutes'); // ✅ Import authentication routes
const codeRoutes = require('./routes/codeRoutes'); // Import code routes

require('dotenv').config(); // Load .env variables


const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json()); // ✅ Add this to parse JSON in requests
app.use('/api/code', codeRoutes);


// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Use authentication routes
app.use('/api', authRoutes);  // This ensures /api/signup works
app.use('/api', codeRoutes); // Add code routes

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Change this in production
    methods: ["GET", "POST"]
  }
});

// Mapping socket connections
const userSocketMap = {};   // Maps socket ID to username
const controllerMap = {};   // Maps room ID to controller socket ID

// Function to get all connected clients in a room
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

io.on('connection', (socket) => {
  console.log(`🟢 Socket Connected: ${socket.id}`);

  // Handle user joining a room
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log(`Users in Room ${roomId}:`, clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, { clients, username, socketId: socket.id });
    });

    // Notify the new user about the current controller
    if (controllerMap[roomId]) {
      socket.emit(ACTIONS.CONTROLLER_CHANGE, { controllerSocketId: controllerMap[roomId] });
    }
  });

  // Handle real-time chat messages
  socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, username, message }) => {
    io.to(roomId).emit(ACTIONS.RECEIVE_MESSAGE, {
      username,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Sync code for new users
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Handle control transfer (Prevent duplicate event)
  socket.on(ACTIONS.TAKE_CONTROL, ({ roomId }) => {
    controllerMap[roomId] = socket.id;
    const controllerUsername = userSocketMap[socket.id];

    // Notify all users in the room
    io.to(roomId).emit(ACTIONS.CONTROLLER_CHANGE, {
      controllerSocketId: socket.id,
      username: controllerUsername,
    });
  });

  // Handle user disconnection
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    
    rooms.forEach((roomId) => {
      if (controllerMap[roomId] === socket.id) {
        delete controllerMap[roomId];
        io.to(roomId).emit(ACTIONS.CONTROLLER_CHANGE, { controllerSocketId: null });
      }

      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
  });

  // Log socket disconnection
  socket.on('disconnect', () => {
    console.log(`🔴 Socket Disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
