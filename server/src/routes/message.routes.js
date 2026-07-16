import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/conversations', messageController.getConversations);
router.get('/:userId', messageController.getMessages);

export default router;
