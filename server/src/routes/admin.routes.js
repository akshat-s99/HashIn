import express from 'express';
import { disableUser, enableUser } from '../controllers/admin.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, requireAdmin);

router.post('/users/:id/disable', disableUser);
router.post('/users/:id/enable', enableUser);

export default router;
