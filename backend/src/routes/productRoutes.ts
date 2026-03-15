// ==========================================
// Product Routes
// ==========================================
import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect, adminOnly } from '../middlewares/auth';

const router = Router();

// Public routes (anyone can browse products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (must be logged in + admin role)
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
