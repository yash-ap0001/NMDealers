import express from 'express';
import { body } from 'express-validator';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { upload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Protected routes
router.post(
  '/',
  verifyToken,
  upload.array('images', 10),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1900 }).withMessage('Valid year is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('mileage').isInt({ min: 0 }).withMessage('Valid mileage is required'),
    body('fuelType').isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Valid fuel type is required'),
    body('transmission').isIn(['Manual', 'Automatic']).withMessage('Valid transmission is required'),
    body('bodyStyle').trim().notEmpty().withMessage('Body style is required'),
    body('color').trim().notEmpty().withMessage('Color is required'),
    body('condition').isIn(['New', 'Used', 'Certified Pre-owned']).withMessage('Valid condition is required'),
  ],
  validateRequest,
  vehicleController.createVehicle
);

router.put(
  '/:id',
  verifyToken,
  upload.array('images', 10),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('make').optional().trim().notEmpty().withMessage('Make cannot be empty'),
    body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
    body('year').optional().isInt({ min: 1900 }).withMessage('Valid year is required'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('mileage').optional().isInt({ min: 0 }).withMessage('Valid mileage is required'),
    body('fuelType').optional().isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Valid fuel type is required'),
    body('transmission').optional().isIn(['Manual', 'Automatic']).withMessage('Valid transmission is required'),
    body('bodyStyle').optional().trim().notEmpty().withMessage('Body style cannot be empty'),
    body('color').optional().trim().notEmpty().withMessage('Color cannot be empty'),
    body('condition').optional().isIn(['New', 'Used', 'Certified Pre-owned']).withMessage('Valid condition is required'),
  ],
  validateRequest,
  vehicleController.updateVehicle
);

router.delete('/:id', verifyToken, vehicleController.deleteVehicle);
router.put('/:id/images', verifyToken, upload.array('images', 10), vehicleController.updateVehicleImages);
router.delete('/:vehicleId/images/:imageId', verifyToken, vehicleController.deleteVehicleImage);

export default router; 