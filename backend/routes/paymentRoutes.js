import express from 'express';
import { submitPayment, getPayments, getPaymentById, getScreenshot, verifyPayment, deletePayment } from '../controllers/paymentController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { uploadMiddleware } from '../config/gridfsConfig.js';

const router = express.Router();

// Submit payment route - requires authentication and uses GridFS storage
router.post('/submit', authMiddleware, uploadMiddleware.single('screenshot'), submitPayment);

// Get all payments for the logged-in user
router.get('/history', authMiddleware, getPayments);

// Get specific payment by ID
router.get('/:id', authMiddleware, getPaymentById);

// Get screenshot for a specific payment
router.get('/:id/screenshot', authMiddleware, getScreenshot);

// Admin route to verify/reject payments
router.patch('/:id/verify', authMiddleware, adminMiddleware, verifyPayment);

// Delete payment and its screenshot
router.delete('/:id', authMiddleware, deletePayment);

export default router;