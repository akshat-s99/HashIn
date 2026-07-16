import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'NEW_MESSAGE', 'POST_LIKE', 'POST_COMMENT'],
    required: true
  },
  content: {
    type: String
  },
  relatedId: {
    // Can be a PostId, MessageId, etc depending on type
    type: mongoose.Schema.Types.ObjectId
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
