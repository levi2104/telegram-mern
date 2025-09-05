import express from "express";
<<<<<<< HEAD
import cors from 'cors'
import cookieParser from 'cookie-parser';
import http from 'http'

import connectToDb from './db/db.js';
import userRoutes from './routes/userRoutes.js'
import captainRoutes from './routes/captainRoutes.js'
import rideRoutes from './routes/rideRoutes.js'
import { initializeSocket } from './socket.js';


dotenv.config();
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

initializeSocket(server)
=======
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { fileURLToPath } from "url";
import path from "path";
import { errorHandlder, notFound } from "./middlewares/errorMiddlewares.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();
>>>>>>> d3808cfd740e15b8894f577daed30ffa259a270c

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

<<<<<<< HEAD
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
=======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
>>>>>>> d3808cfd740e15b8894f577daed30ffa259a270c

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notifications", notificationRoutes);

<<<<<<< HEAD
app.use('/users', userRoutes)
app.use('/captains', captainRoutes)
app.use('/rides', rideRoutes)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
=======

// Error middlewares
app.use(notFound);
app.use(errorHandlder);

const PORT = process.env.PORT || 3000;

// 🔹 Create HTTP server
const server = createServer(app);

// 🔹 Attach Socket.IO
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // frontend URL (change if needed)
  },
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // setup user room (for personal notifications)
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // send and receive messages
  socket.on("new message", (messageData) => {
    const chat = messageData.chat;
    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == messageData.sender._id) return; // skip sender
      socket.in(user._id).emit("message received", messageData);
    });
  });

  // typing
  socket.on("typing", (room, user) => {
    socket.in(room).emit("typing", user); // ✅ send user info
  });

  // stop typing
  socket.on("stop typing", (room, user) => {
    socket.in(room).emit("stop typing", user);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
>>>>>>> d3808cfd740e15b8894f577daed30ffa259a270c
