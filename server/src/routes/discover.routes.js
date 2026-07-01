import express from 'express';
import * as discoverController from '../controllers/discover.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { swipeSchema } from '../validators/discover.validator.js';

const router = express.Router();

router.get('/recommendations', protect, discoverController.getRecommendations);
router.post('/swipe', protect, validate(swipeSchema), discoverController.swipe);

export default router;
