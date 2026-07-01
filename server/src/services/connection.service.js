import { Connection } from '../models/Connection.model.js';
import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS, CONNECTION_STATUS } from '../config/constants.js';

export const sendConnectionRequest = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId.toString()) {
    throw new AppError('Cannot send connection request to yourself', HTTP_STATUS.BAD_REQUEST);
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new AppError('Target user not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check if a connection already exists (pending or accepted) in either direction
  const existingConnection = await Connection.findOne({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  });

  if (existingConnection) {
    if (existingConnection.status === CONNECTION_STATUS.ACCEPTED) {
      throw new AppError('You are already connected with this user', HTTP_STATUS.BAD_REQUEST);
    }
    if (existingConnection.status === CONNECTION_STATUS.PENDING) {
      throw new AppError('A connection request is already pending', HTTP_STATUS.BAD_REQUEST);
    }
  }

  const connection = await Connection.create({
    senderId,
    receiverId,
    status: CONNECTION_STATUS.PENDING
  });

  return connection;
};

export const updateConnectionStatus = async (userId, connectionId, status) => {
  const connection = await Connection.findById(connectionId);

  if (!connection) {
    throw new AppError('Connection request not found', HTTP_STATUS.NOT_FOUND);
  }

  // Only the receiver can accept or reject the request
  if (connection.receiverId.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to respond to this request', HTTP_STATUS.FORBIDDEN);
  }

  if (connection.status !== CONNECTION_STATUS.PENDING) {
    throw new AppError('Connection request has already been processed', HTTP_STATUS.BAD_REQUEST);
  }

  if (status === CONNECTION_STATUS.REJECTED) {
    // If rejected, we simply delete the connection record so they can potentially connect later
    await Connection.findByIdAndDelete(connectionId);
    return { status: 'rejected' };
  }

  connection.status = CONNECTION_STATUS.ACCEPTED;
  await connection.save();

  return connection;
};

export const getUserConnections = async (userId, statusFilter) => {
  const query = {
    $or: [{ senderId: userId }, { receiverId: userId }]
  };

  if (statusFilter) {
    query.status = statusFilter;
  }

  const connections = await Connection.find(query)
    .populate('senderId', 'firstName lastName avatar headline')
    .populate('receiverId', 'firstName lastName avatar headline');

  return connections;
};

export const removeConnection = async (userId, connectionId) => {
  const connection = await Connection.findById(connectionId);
  
  if (!connection) {
    throw new AppError('Connection not found', HTTP_STATUS.NOT_FOUND);
  }

  // Ensure the user deleting it is part of the connection
  if (connection.senderId.toString() !== userId.toString() && connection.receiverId.toString() !== userId.toString()) {
    throw new AppError('Not authorized', HTTP_STATUS.FORBIDDEN);
  }

  await Connection.findByIdAndDelete(connectionId);
};
