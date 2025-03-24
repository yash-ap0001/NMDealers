import express from 'express';
import * as activityController from '../controllers/activity.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(verifyToken);

// Get recent activities
router.get('/', activityController.getActivities);

export default router; 