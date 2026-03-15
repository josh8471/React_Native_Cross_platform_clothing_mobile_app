// ==========================================
// TypeScript Interfaces for the Clothing App
// ==========================================
// These are like "blueprints" that tell TypeScript
// what shape our data should have. This prevents bugs!

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  sizes: string[];
  colors: string[];
  stockQty: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  wishlist: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered';
  stripePaymentId?: string;
  createdAt: string;
}
