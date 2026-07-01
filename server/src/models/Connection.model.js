import mongoose from 'mongoose';
import { CONNECTION_STATUS } from '../config/constants.js';

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CONNECTION_STATUS),
      default: CONNECTION_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate connection requests in any direction
connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export const Connection = mongoose.model('Connection', connectionSchema);
