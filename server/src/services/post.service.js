import { Post } from '../models/Post.model.js';
import { User } from '../models/User.model.js';
import { Connection } from '../models/Connection.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS, CONNECTION_STATUS } from '../config/constants.js';
import { deleteFromCloudinaryByUrl } from '../utils/cloudinaryUtils.js';

export const createPost = async (userId, content, mediaUrl = '') => {
  const post = await Post.create({
    authorId: userId,
    content,
    mediaUrl,
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

  // Cold start problem: If user has no connections and feed is empty, show global recent posts
  if (posts.length === 0 && page === 1) {
    const globalPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId', 'firstName lastName avatar headline')
      .populate('comments.authorId', 'firstName lastName avatar');
    return globalPosts;
  }

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

export const deletePost = async (userId, postId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  }

  if (post.authorId.toString() !== userId.toString()) {
    throw new AppError('Not authorized to delete this post', HTTP_STATUS.FORBIDDEN);
  }

  if (post.mediaUrl && post.mediaUrl.includes('cloudinary.com')) {
    await deleteFromCloudinaryByUrl(post.mediaUrl);
  }

  await Post.findByIdAndDelete(postId);
};

export const toggleLike = async (userId, postId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  }

  const isLiked = post.likes.some(id => id.toString() === userId.toString());

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

export const toggleBookmark = async (userId, postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const isBookmarked = user.bookmarks && user.bookmarks.some(id => id.toString() === postId.toString());

  if (isBookmarked) {
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId.toString());
  } else {
    if (!user.bookmarks) user.bookmarks = [];
    user.bookmarks.push(postId);
  }

  await user.save({ validateModifiedOnly: true });
  return !isBookmarked;
};

export const getBookmarkedPosts = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'bookmarks',
    populate: [
      { path: 'authorId', select: 'firstName lastName avatar headline' },
      { path: 'comments.authorId', select: 'firstName lastName avatar' }
    ]
  });
  
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Filter out any nulls in case a bookmarked post was deleted
  return user.bookmarks.filter(post => post !== null);
};
