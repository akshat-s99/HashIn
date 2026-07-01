import * as postService from '../services/post.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

export const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user._id, req.body.content);
    sendSuccess(res, HTTP_STATUS.CREATED, { post }, 'Post created successfully');
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const posts = await postService.getFeed(req.user._id, page, limit);
    sendSuccess(res, HTTP_STATUS.OK, { posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, { post });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await postService.toggleLike(req.user._id, req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, { post }, 'Like toggled');
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const comment = await postService.addComment(req.user._id, req.params.id, req.body.content);
    sendSuccess(res, HTTP_STATUS.CREATED, { comment }, 'Comment added successfully');
  } catch (error) {
    next(error);
  }
};
