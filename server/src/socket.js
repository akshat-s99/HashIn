import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './config/env.js';
import * as messageService from './services/message.service.js';

let ioInstance;

export const getIo = () => ioInstance;

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing from auth payload'));
      }
      
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  const onlineUsers = new Set();

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}`);
    onlineUsers.add(userId);
    io.emit('online_users', Array.from(onlineUsers));
    
    // Join a personal room for 1-on-1 routing
    socket.join(userId);

    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data;
        const { message, conversation } = await messageService.sendMessage(userId, receiverId, content);
        
        // Emit to receiver
        io.to(receiverId).emit('receive_message', {
          message,
          conversationId: conversation._id,
        });

        // Emit back to sender to confirm
        socket.emit('message_sent', {
          message,
          conversationId: conversation._id,
        });
      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId);
      io.emit('online_users', Array.from(onlineUsers));
    });
  });

  ioInstance = io;
  return io;
};
