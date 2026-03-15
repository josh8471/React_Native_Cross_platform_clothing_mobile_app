// ==========================================
// Order Controller
// ==========================================
// Handles creating orders and viewing order history.

import { Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/auth';

// ── POST /api/orders ─────────────────────────
// Create a new order (for logged-in users)
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No items in order' });
      return;
    }

    const order = await Order.create({
      user: req.user?._id,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ── GET /api/orders/myorders ─────────────────
// Get all orders for the logged-in user
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ── GET /api/orders (Admin only) ─────────────
// Get ALL orders across all users
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ── PUT /api/orders/:id/status (Admin only) ──
// Update order status (e.g. from "processing" to "shipped")
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
