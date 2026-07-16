import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.put('/read', notificationController.markAsRead);

export default router;
