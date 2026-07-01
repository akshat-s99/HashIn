import { Post } from '../models/Post.model.js';
import { Connection } from '../models/Connection.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS, CONNECTION_STATUS } from '../config/constants.js';

export const createPost = async (userId, content) => {
  const post = await Post.create({
    authorId: userId,
    content,
  });

  return await post.populate('authorId', 'firstName lastName avatar headline');
};

export const getFeed = async (userId, page = 1, limit = 10) => {
  // 1. Get all accepted connections
  const connections = await Connection.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    status: CONNECTION_STATUS.ACCEPTED,
  });

  // Extract connection user IDs
  const connectionUserIds = connections.map(conn => 
    conn.senderId.toString() === userId.toString() ? conn.receiverId : conn.senderId
  );

  // 2. Add the current user to the list (so they see their own posts in their feed)
  connectionUserIds.push(userId);

  // 3. Find posts authored by these users, paginated
  const skip = (page - 1) * limit;

  const posts = await Post.find({ authorId: { $in: connectionUserIds } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('authorId', 'firstName lastName avatar headline')
    .populate('comments.authorId', 'firstName lastName avatar');

  return posts;
};

export const getPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate('authorId', 'firstName lastName avatar headline')
    .populate('comments.authorId', 'firstName lastName avatar');

  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  }

  return post;
};

export const toggleLike = async (userId, postId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();
  return post;
};

export const addComment = async (userId, postId, content) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  }

  post.comments.push({
    authorId: userId,
    content,
  });

  await post.save();
  
  // Return the newly created comment (the last one in the array)
  // Re-populate to get author info for the new comment
  await post.populate('comments.authorId', 'firstName lastName avatar');
  
  return post.comments[post.comments.length - 1];
};
