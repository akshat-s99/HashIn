import { Conversation } from '../models/Conversation.model.js';
import { Message } from '../models/Message.model.js';
import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';

export const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: { $in: [userId] },
  })
    .populate('participants', 'firstName lastName avatar headline')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
  
  return conversations;
};

export const getMessages = async (userId, otherUserId) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    return [];
  }

  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 });
  
  return messages;
};

export const sendMessage = async (senderId, receiverId, content) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    receiverId,
    content,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  return { message, conversation };
};
