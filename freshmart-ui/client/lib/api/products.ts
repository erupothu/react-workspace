import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSearchParams,
  ApiResponse,
  StockAlert,
  InventoryMovement
} from '@shared/api';
import { API_BASE_URL, fetchAPI } from './base';
import React, { useState, useRef, useEffect } from "react";

class ProductAPI {

  // Get all products with optional search and filtering
  async getProducts(params: ProductSearchParams = {}): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchAPI<Product[]>(endpoint, { method: 'GET' });
  }

  // Get a single product by ID
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return fetchAPI<Product>(`/products/${id}`, { method: 'GET' });
  }

  // Create a new product
  async createProduct(product: CreateProductRequest): Promise<ApiResponse<Product>> {
    return fetchAPI<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // Update an existing product
  async updateProduct(id: string, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return fetchAPI<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  // Partially update a product
  async patchProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    return fetchAPI<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Delete a product
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/products/${id}`, { method: 'DELETE' });
  }

  // Bulk operations
  async bulkUpdateProducts(updates: { id: string; updates: Partial<Product> }[]): Promise<ApiResponse<Product[]>> {
    return fetchAPI<Product[]>('/products/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });
  }

  async bulkDeleteProducts(ids: string[]): Promise<ApiResponse<void>> {
    return fetchAPI<void>('/products/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // Update product status
  async updateProductStatus(id: string, status: Product['status']): Promise<ApiResponse<Product>> {
    return fetchAPI<Product>(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Update product stock
  async updateProductStock(id: string, stock: number, reason?: string): Promise<ApiResponse<Product>> {
    return fetchAPI<Product>(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock, reason }),
    });
  }

  // Get products by category
  async getProductsByCategory(categoryId: string, params: ProductSearchParams = {}): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/products/category/${categoryId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchAPI<Product[]>(endpoint, { method: 'GET' });
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return fetchAPI<Product[]>(`/products/featured?limit=${limit}`, { method: 'GET' });
  }

  // Get products with low stock
  async getLowStockProducts(threshold?: number): Promise<ApiResponse<Product[]>> {
    const endpoint = `/products/low-stock${threshold ? `?threshold=${threshold}` : ''}`;
    return fetchAPI<Product[]>(endpoint, { method: 'GET' });
  }

  // Get out of stock products
  async getOutOfStockProducts(): Promise<ApiResponse<Product[]>> {
    return fetchAPI<Product[]>('/products/out-of-stock', { method: 'GET' });
  }

  // Search products with advanced filters
  async searchProducts(query: string, filters: Omit<ProductSearchParams, 'query'> = {}): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams({ query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return fetchAPI<Product[]>(`/products/search?${searchParams.toString()}`, { method: 'GET' });
  }

  // Get product variants/related products
  async getRelatedProducts(id: string, limit: number = 5): Promise<ApiResponse<Product[]>> {
    return fetchAPI<Product[]>(`/products/${id}/related?limit=${limit}`, { method: 'GET' });
  }

  // Get product reviews
  async getProductReviews(id: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any[]>> {
    return fetchAPI<any[]>(`/products/${id}/reviews?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Upload product images
  async uploadProductImages(id: string, files: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });

    return fetchAPI<string[]>(`/products/${id}/images`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Delete product image
  async deleteProductImage(id: string, imageUrl: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/products/${id}/images`, {
      method: 'DELETE',
      body: JSON.stringify({ imageUrl }),
    });
  }

  // Import products from CSV/Excel
  async importProducts(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    return fetchAPI<{ imported: number; errors: string[] }>('/products/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Export products to CSV/Excel
  async exportProducts(params: ProductSearchParams = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const searchParams = new URLSearchParams({ format });
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/products/export?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Get stock alerts
  async getStockAlerts(page: number = 1, limit: number = 20): Promise<ApiResponse<StockAlert[]>> {
    return fetchAPI<StockAlert[]>(`/products/stock-alerts?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Get inventory movements for a product
  async getInventoryMovements(productId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<InventoryMovement[]>> {
    return fetchAPI<InventoryMovement[]>(`/products/${productId}/inventory-movements?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Add inventory movement
  async addInventoryMovement(productId: string, movement: Omit<InventoryMovement, 'id' | 'productId' | 'createdAt' | 'createdBy'>): Promise<ApiResponse<InventoryMovement>> {
    return fetchAPI<InventoryMovement>(`/products/${productId}/inventory-movements`, {
      method: 'POST',
      body: JSON.stringify(movement),
    });
  }

  // Get product statistics
  async getProductStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    lowStock: number;
    totalValue: number;
    byCategory: { categoryId: string; count: number }[];
  }>> {
    return fetchAPI('/products/stats', { method: 'GET' });
  }

  // Check product availability
  async checkAvailability(productId: string, quantity: number, location?: string): Promise<ApiResponse<{
    available: boolean;
    availableQuantity: number;
    estimatedRestockDate?: string;
  }>> {
    const params = new URLSearchParams({ quantity: quantity.toString() });
    if (location) params.append('location', location);
    
    return fetchAPI(`/products/${productId}/availability?${params.toString()}`, { method: 'GET' });
  }

  // Reserve product stock (for cart/order processing)
  async reserveStock(productId: string, quantity: number, reservationId: string): Promise<ApiResponse<{
    reserved: boolean;
    expiresAt: string;
  }>> {
    return fetchAPI(`/products/${productId}/reserve`, {
      method: 'POST',
      body: JSON.stringify({ quantity, reservationId }),
    });
  }

  // Release reserved stock
  async releaseReservedStock(productId: string, reservationId: string): Promise<ApiResponse<void>> {
    return fetchAPI(`/products/${productId}/release-reservation`, {
      method: 'POST',
      body: JSON.stringify({ reservationId }),
    });
  }
}

export const productAPI = new ProductAPI();
export default productAPI;
