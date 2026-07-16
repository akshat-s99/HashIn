import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.put('/me', protect, validate(updateProfileSchema), userController.updateMe);
router.delete('/me', protect, userController.deleteMe);
router.post('/avatar', protect, upload.single('avatar'), userController.uploadAvatar);
router.get('/search', protect, userController.searchUsers);
router.get('/:userId', protect, userController.getUser);

export default router;
