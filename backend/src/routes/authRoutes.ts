// ==========================================
// Auth Routes
// ==========================================
import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

// Public routes (no login needed)
router.post('/register', register);
router.post('/login', login);

// Protected route (must be logged in)
router.get('/me', protect, getMe);

export default router;
