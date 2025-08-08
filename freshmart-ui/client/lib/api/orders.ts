import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderSearchParams,
  ApiResponse,
  OrderItem
} from '@shared/api';
import { fetchAPI } from './base';

const API_BASE_URL = 'http://localhost:9090/api';

class OrderAPI {

  // Get all orders with optional search and filtering
  async getOrders(params: OrderSearchParams = {}): Promise<ApiResponse<Order[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/orders${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchAPI<Order[]>(endpoint, { method: 'GET' });
  }

  // Get a single order by ID
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}`, { method: 'GET' });
  }

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/number/${orderNumber}`, { method: 'GET' });
  }

  // Create a new order
  async createOrder(order: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Update an existing order
  async updateOrder(id: string, order: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  }

  // Partially update an order
  async patchOrder(id: string, updates: Partial<Order>): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Cancel an order
  async cancelOrder(id: string, reason: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Update order status
  async updateOrderStatus(id: string, status: Order['status'], notes?: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus'], paymentId?: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus, paymentId }),
    });
  }

  // Assign delivery boy to order
  async assignDeliveryBoy(id: string, deliveryBoyId: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/assign-delivery`, {
      method: 'PATCH',
      body: JSON.stringify({ deliveryBoyId }),
    });
  }

  // Update tracking information
  async updateTracking(id: string, trackingId: string, location?: { latitude: number; longitude: number }, notes?: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/tracking`, {
      method: 'PATCH',
      body: JSON.stringify({ trackingId, location, notes }),
    });
  }

  // Get orders by customer
  async getCustomerOrders(customerId: string, params: Omit<OrderSearchParams, 'customerId'> = {}): Promise<ApiResponse<Order[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/orders/customer/${customerId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchAPI<Order[]>(endpoint, { method: 'GET' });
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status'], params: Omit<OrderSearchParams, 'status'> = {}): Promise<ApiResponse<Order[]>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const endpoint = `/orders/status/${status}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return fetchAPI<Order[]>(endpoint, { method: 'GET' });
  }

  // Get orders for delivery boy
  async getDeliveryBoyOrders(deliveryBoyId: string, status?: Order['status']): Promise<ApiResponse<Order[]>> {
    const params = status ? `?status=${status}` : '';
    return fetchAPI<Order[]>(`/orders/delivery-boy/${deliveryBoyId}${params}`, { method: 'GET' });
  }

  // Get pending orders (for admin dashboard)
  async getPendingOrders(): Promise<ApiResponse<Order[]>> {
    return fetchAPI<Order[]>('/orders/pending', { method: 'GET' });
  }

  // Get today's orders
  async getTodayOrders(): Promise<ApiResponse<Order[]>> {
    return fetchAPI<Order[]>('/orders/today', { method: 'GET' });
  }

  // Search orders
  async searchOrders(query: string, filters: Omit<OrderSearchParams, 'orderNumber'> = {}): Promise<ApiResponse<Order[]>> {
    const searchParams = new URLSearchParams({ query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return fetchAPI<Order[]>(`/orders/search?${searchParams.toString()}`, { method: 'GET' });
  }

  // Get order statistics
  async getOrderStats(period?: 'today' | 'week' | 'month' | 'year'): Promise<ApiResponse<{
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
    refunded: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: { status: string; count: number }[];
    revenueByDay: { date: string; revenue: number; orders: number }[];
  }>> {
    const params = period ? `?period=${period}` : '';
    return fetchAPI(`/orders/stats${params}`, { method: 'GET' });
  }

  // Calculate order totals (for cart/checkout)
  async calculateOrderTotals(items: Array<{ productId: string; quantity: number }>, deliveryAddressId?: string, couponCode?: string): Promise<ApiResponse<{
    subtotal: number;
    tax: number;
    deliveryFee: number;
    discount: number;
    total: number;
    appliedCoupon?: {
      code: string;
      discount: number;
      type: 'percentage' | 'fixed_amount';
    };
  }>> {
    return fetchAPI('/orders/calculate-totals', {
      method: 'POST',
      body: JSON.stringify({ items, deliveryAddressId, couponCode }),
    });
  }

  // Process refund
  async processRefund(id: string, amount: number, reason: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  }

  // Generate invoice
  async generateInvoice(id: string, format: 'pdf' | 'html' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/invoice?format=${format}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Invoice generation failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Send order notifications
  async sendOrderNotification(id: string, type: 'confirmation' | 'status_update' | 'delivery_reminder'): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/orders/${id}/notifications`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  // Bulk update orders
  async bulkUpdateOrders(updates: { id: string; updates: Partial<Order> }[]): Promise<ApiResponse<Order[]>> {
    return fetchAPI<Order[]>('/orders/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });
  }

  // Export orders
  async exportOrders(params: OrderSearchParams = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const searchParams = new URLSearchParams({ format });
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/orders/export?${searchParams.toString()}`, {
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

  // Get order timeline/history
  async getOrderTimeline(id: string): Promise<ApiResponse<Array<{
    timestamp: string;
    status: string;
    description: string;
    updatedBy?: string;
    location?: { latitude: number; longitude: number };
  }>>> {
    return fetchAPI(`/orders/${id}/timeline`, { method: 'GET' });
  }

  // Update delivery address
  async updateDeliveryAddress(id: string, addressId: string): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/delivery-address`, {
      method: 'PATCH',
      body: JSON.stringify({ addressId }),
    });
  }

  // Update delivery slot
  async updateDeliverySlot(id: string, deliverySlot: { date: string; timeSlot: string }): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/delivery-slot`, {
      method: 'PATCH',
      body: JSON.stringify({ deliverySlot }),
    });
  }

  // Add order notes
  async addOrderNotes(id: string, notes: string, isInternal: boolean = false): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes, isInternal }),
    });
  }

  // Resend order confirmation
  async resendConfirmation(id: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/orders/${id}/resend-confirmation`, {
      method: 'POST',
    });
  }

  // Mark order as priority
  async markAsPriority(id: string, priority: boolean): Promise<ApiResponse<Order>> {
    return fetchAPI<Order>(`/orders/${id}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  }

  // Get estimated delivery time
  async getEstimatedDelivery(addressId: string, items: Array<{ productId: string; quantity: number }>): Promise<ApiResponse<{
    estimatedTime: string;
    availableSlots: Array<{
      date: string;
      timeSlots: Array<{
        slot: string;
        available: boolean;
        estimatedDelivery: string;
      }>;
    }>;
  }>> {
    return fetchAPI('/orders/estimated-delivery', {
      method: 'POST',
      body: JSON.stringify({ addressId, items }),
    });
  }

  // Validate coupon
  async validateCoupon(code: string, customerId: string, items: Array<{ productId: string; quantity: number }>): Promise<ApiResponse<{
    valid: boolean;
    discount: number;
    type: 'percentage' | 'fixed_amount';
    message?: string;
  }>> {
    return fetchAPI('/orders/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, customerId, items }),
    });
  }

  // Get order recommendations (based on order history)
  async getOrderRecommendations(customerId: string, limit: number = 10): Promise<ApiResponse<Array<{
    productId: string;
    productName: string;
    image: string;
    price: number;
    reason: string;
  }>>> {
    return fetchAPI(`/orders/recommendations/${customerId}?limit=${limit}`, { method: 'GET' });
  }
}

export const orderAPI = new OrderAPI();
export default orderAPI;
