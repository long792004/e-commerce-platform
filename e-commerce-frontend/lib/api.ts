import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5057';

// Create axios instance with auth interceptor
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ======================== TYPES ========================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  image?: File;
}

export interface AuthResponse {
  id: number;
  email: string;
  fullName: string;
  token: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

// ======================== PRODUCT API ========================

export const productApi = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/api/products');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  async create(data: ProductCreateRequest): Promise<Product> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    const response = await api.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: number, data: ProductCreateRequest): Promise<Product> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    const response = await api.put(`/api/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },
};

// ======================== AUTH API ========================

export const authApi = {
  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', { email, password, fullName });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

// ======================== CART API ========================

export const cartApi = {
  async getCart(): Promise<CartResponse> {
    const response = await api.get('/api/cart');
    return response.data;
  },

  async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
    const response = await api.post('/api/cart', { productId, quantity });
    return response.data;
  },

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const response = await api.put(`/api/cart/${itemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(itemId: number): Promise<void> {
    await api.delete(`/api/cart/${itemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/api/cart');
  },
};

// ======================== ORDER API ========================

export const orderApi = {
  async checkout(): Promise<OrderResponse> {
    const response = await api.post('/api/orders/checkout');
    return response.data;
  },

  async getOrders(): Promise<OrderResponse[]> {
    const response = await api.get('/api/orders');
    return response.data;
  },

  async getOrder(orderId: number): Promise<OrderResponse> {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  async payOrder(orderId: number): Promise<OrderResponse> {
    const response = await api.put(`/api/orders/${orderId}/pay`);
    return response.data;
  },
};
