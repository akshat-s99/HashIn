import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.put('/me', protect, validate(updateProfileSchema), userController.updateMe);
router.get('/:userId', protect, userController.getUser);

export default router;
