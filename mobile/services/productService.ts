// ==========================================
// Product API Service
// ==========================================
// Functions to call the backend product endpoints.
// Used by the Shop and Product Detail screens.

import api from './api';
import { Product } from '../types';

interface ProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalProducts: number;
}

// Get all products with optional filters
export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>('/products', { params });
  return data;
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};
