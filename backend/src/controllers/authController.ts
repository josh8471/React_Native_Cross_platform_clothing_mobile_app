// ==========================================
// Auth Controller
// ==========================================
// Handles user registration and login.
// Returns a JWT token on success.

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';

// Helper: Generate a JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Token valid for 30 days
  });
};

// ── POST /api/auth/register ──────────────────
// Creates a new user account
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create the user (password gets hashed automatically by the model)
    const user = await User.create({ name, email, password });

    // Return user data + token
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ── POST /api/auth/login ─────────────────────
// Authenticates a user and returns a token
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password field
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        wishlist: user.wishlist,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// ── GET /api/auth/me ─────────────────────────
// Returns the currently logged-in user's profile
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({
      _id: req.user?._id,
      name: req.user?.name,
      email: req.user?.email,
      role: req.user?.role,
      wishlist: req.user?.wishlist,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
