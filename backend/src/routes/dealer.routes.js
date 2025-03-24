import express from 'express';
import { body } from 'express-validator';
import * as dealerController from '../controllers/dealer.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register a new dealer
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
  ],
  validateRequest,
  dealerController.register
);

// Login dealer
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  dealerController.login
);

// Protected routes
router.use(verifyToken);

// Get dealer profile
router.get('/profile', dealerController.getProfile);

// Update dealer profile
router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
    body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
    body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  ],
  validateRequest,
  dealerController.updateProfile
);

export default router; 