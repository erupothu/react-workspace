import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerSearchParams,
  Address,
  ApiResponse
} from '@shared/api';
import { fetchAPI } from './base';

const API_BASE_URL = 'http://localhost:9090/api';

class CustomerAPI {

  // Get all customers with optional search and filtering
  async getCustomers(params: CustomerSearchParams = {}): Promise<ApiResponse<Customer[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/customers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchAPI<Customer[]>(endpoint, { method: 'GET' });
  }

  // Get a single customer by ID
  async getAllCustomers(): Promise<ApiResponse<Customer[]>> {
    return fetchAPI<Customer[]>(`/customers`, { method: 'GET' });
  }

  // Get a single customer by ID
  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/${id}`, { method: 'GET' });
  }

  // Get customer by email
  async getCustomerByEmail(email: string): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/email/${encodeURIComponent(email)}`, { method: 'GET' });
  }

  // Get customer by phone
  async getCustomerByPhone(phone: string): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/phone/${encodeURIComponent(phone)}`, { method: 'GET' });
  }

  // Create a new customer
  async createCustomer(customer: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>('/customers/register', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  // Update an existing customer
  async updateCustomer(id: string, customer: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  // Partially update a customer
  async patchCustomer(id: string, updates: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Delete a customer (soft delete)
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${id}`, { method: 'DELETE' });
  }

  // Update customer status
  async updateCustomerStatus(id: string, status: Customer['status']): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Search customers
  async searchCustomers(query: string, filters: Omit<CustomerSearchParams, 'query'> = {}): Promise<ApiResponse<Customer[]>> {
    const searchParams = new URLSearchParams({ query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return fetchAPI<Customer[]>(`/customers/search?${searchParams.toString()}`, { method: 'GET' });
  }

  // Get customer statistics
  async getCustomerStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    blocked: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    topSpenders: Array<{
      customerId: string;
      customerName: string;
      totalSpent: number;
      totalOrders: number;
    }>;
    registrationTrend: Array<{
      date: string;
      count: number;
    }>;
  }>> {
    return fetchAPI('/customers/stats', { method: 'GET' });
  }

  // Get recently registered customers
  async getRecentCustomers(limit: number = 10): Promise<ApiResponse<Customer[]>> {
    return fetchAPI<Customer[]>(`/customers/recent?limit=${limit}`, { method: 'GET' });
  }

  // Get top customers by spending
  async getTopCustomers(limit: number = 10, period: 'month' | 'year' | 'all' = 'all'): Promise<ApiResponse<Array<Customer & { totalSpent: number; totalOrders: number }>>> {
    return fetchAPI(`/customers/top?limit=${limit}&period=${period}`, { method: 'GET' });
  }

  // Upload customer avatar
  async uploadAvatar(id: string, file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return fetchAPI<string>(`/customers/${id}/avatar`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Delete customer avatar
  async deleteAvatar(id: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${id}/avatar`, {
      method: 'DELETE',
    });
  }

  // Update customer loyalty points
  async updateLoyaltyPoints(id: string, points: number, reason: string): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>(`/customers/${id}/loyalty-points`, {
      method: 'PATCH',
      body: JSON.stringify({ points, reason }),
    });
  }

  // Customer Address Management
  
  // Get customer addresses
  async getCustomerAddresses(customerId: string): Promise<ApiResponse<Address[]>> {
    return fetchAPI<Address[]>(`/customers/${customerId}/addresses`, { method: 'GET' });
  }

  // Add new address for customer
  async addCustomerAddress(customerId: string, address: Omit<Address, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Address>> {
    return fetchAPI<Address>(`/customers/${customerId}/addresses`, {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }

  // Update customer address
  async updateCustomerAddress(customerId: string, addressId: string, address: Partial<Address>): Promise<ApiResponse<Address>> {
    return fetchAPI<Address>(`/customers/${customerId}/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  }

  // Delete customer address
  async deleteCustomerAddress(customerId: string, addressId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${customerId}/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  // Set default address
  async setDefaultAddress(customerId: string, addressId: string): Promise<ApiResponse<Address>> {
    return fetchAPI<Address>(`/customers/${customerId}/addresses/${addressId}/set-default`, {
      method: 'PATCH',
    });
  }

  // Customer Analytics and History

  // Get customer order history
  async getCustomerOrderHistory(customerId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any[]>> {
    return fetchAPI(`/customers/${customerId}/orders?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Get customer analytics
  async getCustomerAnalytics(customerId: string, period: 'month' | 'quarter' | 'year' = 'year'): Promise<ApiResponse<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteCategories: Array<{
      categoryId: string;
      categoryName: string;
      orderCount: number;
      totalSpent: number;
    }>;
    orderFrequency: {
      ordersPerMonth: number;
      lastOrderDate: string;
    };
    spendingTrend: Array<{
      month: string;
      amount: number;
      orders: number;
    }>;
  }>> {
    return fetchAPI(`/customers/${customerId}/analytics?period=${period}`, { method: 'GET' });
  }

  // Get customer wishlist
  async getCustomerWishlist(customerId: string): Promise<ApiResponse<Array<{
    productId: string;
    productName: string;
    price: number;
    image: string;
    addedAt: string;
  }>>> {
    return fetchAPI(`/customers/${customerId}/wishlist`, { method: 'GET' });
  }

  // Add to customer wishlist
  async addToWishlist(customerId: string, productId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${customerId}/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  // Remove from customer wishlist
  async removeFromWishlist(customerId: string, productId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${customerId}/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Customer Communication

  // Send notification to customer
  async sendNotification(customerId: string, notification: {
    type: 'email' | 'sms' | 'push';
    title: string;
    message: string;
    data?: any;
  }): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${customerId}/notifications`, {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  // Get customer notifications
  async getCustomerNotifications(customerId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<any[]>> {
    return fetchAPI(`/customers/${customerId}/notifications?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Mark notification as read
  async markNotificationRead(customerId: string, notificationId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/customers/${customerId}/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Bulk Operations

  // Bulk update customers
  async bulkUpdateCustomers(updates: { id: string; updates: Partial<Customer> }[]): Promise<ApiResponse<Customer[]>> {
    return fetchAPI<Customer[]>('/customers/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });
  }

  // Export customers
  async exportCustomers(params: CustomerSearchParams = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const searchParams = new URLSearchParams({ format });
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/customers/export?${searchParams.toString()}`, {
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

  // Import customers
  async importCustomers(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    return fetchAPI<{ imported: number; errors: string[] }>('/customers/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Check email availability
  async checkEmailAvailability(email: string, excludeId?: string): Promise<ApiResponse<{ available: boolean }>> {
    const params = new URLSearchParams({ email });
    if (excludeId) params.append('excludeId', excludeId);
    
    return fetchAPI(`/customers/check-email?${params.toString()}`, { method: 'GET' });
  }

  // Check phone availability
  async checkPhoneAvailability(phone: string, excludeId?: string): Promise<ApiResponse<{ available: boolean }>> {
    const params = new URLSearchParams({ phone });
    if (excludeId) params.append('excludeId', excludeId);
    
    return fetchAPI(`/customers/check-phone?${params.toString()}`, { method: 'GET' });
  }

  // Get customer segments (for marketing)
  async getCustomerSegments(): Promise<ApiResponse<Array<{
    segmentId: string;
    name: string;
    description: string;
    customerCount: number;
    criteria: any;
  }>>> {
    return fetchAPI('/customers/segments', { method: 'GET' });
  }

  // Get customers by segment
  async getCustomersBySegment(segmentId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Customer[]>> {
    return fetchAPI<Customer[]>(`/customers/segments/${segmentId}/customers?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Customer Reviews and Feedback

  // Get customer reviews
  async getCustomerReviews(customerId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any[]>> {
    return fetchAPI(`/customers/${customerId}/reviews?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Customer Support

  // Create support ticket for customer
  async createSupportTicket(customerId: string, ticket: {
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
  }): Promise<ApiResponse<any>> {
    return fetchAPI(`/customers/${customerId}/support-tickets`, {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  // Get customer support tickets
  async getCustomerSupportTickets(customerId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any[]>> {
    return fetchAPI(`/customers/${customerId}/support-tickets?page=${page}&limit=${limit}`, { method: 'GET' });
  }

  // Get customer lifetime value
  async getCustomerLifetimeValue(customerId: string): Promise<ApiResponse<{
    totalSpent: number;
    totalOrders: number;
    averageOrderValue: number;
    customerLifetimeValue: number;
    predictedValue: number;
    loyaltyScore: number;
  }>> {
    return fetchAPI(`/customers/${customerId}/lifetime-value`, { method: 'GET' });
  }
}

export const customerAPI = new CustomerAPI();
export default customerAPI;
