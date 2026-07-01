import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema, commentSchema } from '../validators/post.validator.js';

const router = express.Router();

router.post('/', protect, validate(createPostSchema), postController.createPost);
router.get('/', protect, postController.getFeed);
router.get('/:id', protect, postController.getPost);
router.put('/:id/like', protect, postController.toggleLike);
router.post('/:id/comments', protect, validate(commentSchema), postController.addComment);

export default router;
