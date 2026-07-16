import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPostSchema, commentSchema } from '../validators/post.validator.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', protect, upload.single('media'), validate(createPostSchema), postController.createPost);
router.get('/', protect, postController.getFeed);
router.get('/bookmarks', protect, postController.getBookmarkedPosts);
router.get('/:id', protect, postController.getPost);
router.delete('/:id', protect, postController.deletePost);
router.put('/:id/like', protect, postController.toggleLike);
router.post('/:id/comments', protect, validate(commentSchema), postController.addComment);
router.post('/:id/bookmark', protect, postController.toggleBookmark);

export default router;
