// ==========================================
// Order Routes
// ==========================================
import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// All order routes require login
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin-only routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
