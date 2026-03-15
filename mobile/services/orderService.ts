// ==========================================
// Order API Service (Mobile)
// ==========================================
// Functions to create orders and process payments.

import api from './api';

interface PaymentIntentResponse {
  clientSecret: string;
  orderId: string;
}

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// Create a Stripe payment intent
export const createPaymentIntent = async (
  items: OrderItem[],
  totalAmount: number,
  shippingAddress: ShippingAddress
): Promise<PaymentIntentResponse> => {
  const { data } = await api.post<PaymentIntentResponse>('/payments/create-intent', {
    items,
    totalAmount,
    shippingAddress,
  });
  return data;
};

// Confirm order after payment
export const confirmOrderPayment = async (orderId: string): Promise<void> => {
  await api.post('/payments/confirm', { orderId });
};

// Get user's order history
export const getMyOrders = async () => {
  const { data } = await api.get('/orders/myorders');
  return data;
};
