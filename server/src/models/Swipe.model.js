import mongoose from 'mongoose';
import { SWIPE_ACTION } from '../config/constants.js';

const swipeSchema = new mongoose.Schema(
  {
    swiperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    swipedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: Object.values(SWIPE_ACTION),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only swipe another user once
swipeSchema.index({ swiperId: 1, swipedId: 1 }, { unique: true });

export const Swipe = mongoose.model('Swipe', swipeSchema);
