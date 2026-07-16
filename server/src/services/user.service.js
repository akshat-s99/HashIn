import mongoose from 'mongoose';
import { User } from '../models/User.model.js';
import { Post } from '../models/Post.model.js';
import { Connection } from '../models/Connection.model.js';
import { Notification } from '../models/Notification.model.js';
import { Swipe } from '../models/Swipe.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { deleteFromCloudinaryByUrl } from '../utils/cloudinaryUtils.js';

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

export const getPublicProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  // Mass assignment guard - only allow safe fields
  const allowedFields = ['firstName', 'lastName', 'headline', 'about', 'skills', 'location', 'links', 'experience', 'education', 'avatar'];
  const sanitizedData = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      sanitizedData[key] = updateData[key];
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedData },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  
  return user;
};

export const searchUsers = async (query) => {
  if (!query) return [];
  
  const searchRegex = new RegExp(query, 'i');
  
  const users = await User.find({
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { headline: searchRegex }
    ]
  })
  .select('firstName lastName avatar headline')
  .limit(10);
  
  return users;
};

export const deleteUserAccount = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // 1. Delete avatar from Cloudinary
    if (user.avatar && user.avatar.includes('cloudinary.com')) {
      await deleteFromCloudinaryByUrl(user.avatar);
    }

    // 2. Find all posts by user to delete their media
    const userPosts = await Post.find({ authorId: userId }).session(session);
    for (const post of userPosts) {
      if (post.mediaUrl && post.mediaUrl.includes('cloudinary.com')) {
        await deleteFromCloudinaryByUrl(post.mediaUrl);
      }
    }

    // 3. Cascade deletes in the DB
    await Post.deleteMany({ authorId: userId }).session(session);
    await Swipe.deleteMany({ $or: [{ swiperId: userId }, { swipedId: userId }] }).session(session);
    await Connection.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }).session(session);
    await Notification.deleteMany({ $or: [{ recipientId: userId }, { senderId: userId }] }).session(session);

    // Remove user's likes from other posts
    await Post.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    ).session(session);

    // Delete the user
    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
