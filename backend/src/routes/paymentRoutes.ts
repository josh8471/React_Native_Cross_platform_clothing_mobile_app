// ==========================================
// Payment Routes
// ==========================================
import { Router } from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/paymentController';
import { protect } from '../middlewares/auth';

const router = Router();

// All payment routes require login
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);

export default router;
