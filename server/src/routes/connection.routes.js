import express from 'express';
import * as connectionController from '../controllers/connection.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateConnectionSchema } from '../validators/connection.validator.js';

const router = express.Router();

router.post('/request/:userId', protect, connectionController.requestConnection);
router.put('/:connectionId/status', protect, validate(updateConnectionSchema), connectionController.updateStatus);
router.get('/', protect, connectionController.getConnections);
router.delete('/:connectionId', protect, connectionController.removeConnection);

export default router;
