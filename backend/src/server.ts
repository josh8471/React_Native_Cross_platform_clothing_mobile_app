// ==========================================
// Server Entry Point (Updated)
// ==========================================
// This is the main file that starts your backend.
// It connects to MongoDB, loads all the route files,
// and starts listening for requests from the mobile app.

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// Load environment variables from .env file FIRST
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';

// Import route files
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware Setup ─────────────────────────
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// ── Health Check ─────────────────────────────
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running beautifully! 🚀' });
});

// ── API Routes ───────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// ── 404 Handler ──────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Start the Server ─────────────────────────
// First connect to MongoDB, THEN start listening
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
