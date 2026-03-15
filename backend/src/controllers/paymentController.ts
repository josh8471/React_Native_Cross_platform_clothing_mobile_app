// ==========================================
// Payment Controller (Stripe)
// ==========================================
// Creates a Stripe "PaymentIntent" which is a secure
// way to process credit card payments.
//
// How it works (in simple terms):
// 1. Mobile app says "I want to pay $100"
// 2. This controller asks Stripe: "Create a payment session for $100"
// 3. Stripe returns a "client secret" (a special key)
// 4. Mobile app uses that key to show a secure payment form
// 5. Customer enters card → Stripe processes it → Done!

import { Response } from 'express';
import Stripe from 'stripe';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/auth';

// Lazy initialize Stripe to prevent crash if env var is missing during import
let stripeInstance: Stripe | null = null;
const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is missing in .env file');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

// ── POST /api/payments/create-intent ─────────
// Creates a payment intent for an order
export const createPaymentIntent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const stripe = getStripe();
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No items provided' });
      return;
    }

    // Create the order in our database first (status: pending)
    const order = await Order.create({
      user: req.user?._id,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'processing',
    });

    // Create a Stripe PaymentIntent
    // Amount is in CENTS, so $100.00 = 10000
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user?._id.toString() || '',
      },
    });

    // Save the Stripe payment ID to our order
    order.stripePaymentId = paymentIntent.id;
    await order.save();

    // Send back the client secret — the mobile app needs this
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error: any) {
    console.error('Payment error:', error.message);
    res.status(500).json({ message: error.message || 'Payment failed' });
  }
};

// ── POST /api/payments/confirm ───────────────
// Called after payment succeeds on the mobile app
export const confirmPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.paymentStatus = 'completed';
    await order.save();

    res.json({ message: 'Payment confirmed', order });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Confirmation failed' });
  }
};
