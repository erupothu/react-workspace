import {
  DashboardStats,
  SalesAnalytics,
  ApiResponse
} from '@shared/api';
import { API_BASE_URL, fetchAPI } from './base';

class DashboardAPI {

  // Get dashboard overview statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return fetchAPI<DashboardStats>('/dashboard/stats', { method: 'GET' });
  }

  // Get sales analytics for a specific period
  async getSalesAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<SalesAnalytics>> {
    return fetchAPI<SalesAnalytics>(`/dashboard/sales-analytics?period=${period}`, { method: 'GET' });
  }

  // Get revenue trend
  async getRevenueTrend(period: 'day' | 'week' | 'month' | 'year' = 'month', days: number = 30): Promise<ApiResponse<Array<{
    date: string;
    revenue: number;
    orders: number;
    customers: number;
  }>>> {
    return fetchAPI(`/dashboard/revenue-trend?period=${period}&days=${days}`, { method: 'GET' });
  }

  // Get top selling products
  async getTopProducts(limit: number = 10, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<Array<{
    productId: string;
    productName: string;
    image: string;
    totalSold: number;
    revenue: number;
    category: string;
  }>>> {
    return fetchAPI(`/dashboard/top-products?limit=${limit}&period=${period}`, { method: 'GET' });
  }

  // Get top categories by sales
  async getTopCategories(limit: number = 10, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<Array<{
    categoryId: string;
    categoryName: string;
    totalSales: number;
    totalOrders: number;
    productsCount: number;
  }>>> {
    return fetchAPI(`/dashboard/top-categories?limit=${limit}&period=${period}`, { method: 'GET' });
  }

  // Get customer analytics
  async getCustomerAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
    averageLifetimeValue: number;
    customerSegments: Array<{
      segment: string;
      count: number;
      percentage: number;
    }>;
    customerGrowth: Array<{
      date: string;
      newCustomers: number;
      totalCustomers: number;
    }>;
  }>> {
    return fetchAPI(`/dashboard/customer-analytics?period=${period}`, { method: 'GET' });
  }

  // Get inventory alerts
  async getInventoryAlerts(): Promise<ApiResponse<{
    lowStock: Array<{
      productId: string;
      productName: string;
      currentStock: number;
      minStock: number;
      category: string;
    }>;
    outOfStock: Array<{
      productId: string;
      productName: string;
      category: string;
      lastStockDate: string;
    }>;
    expiringSoon: Array<{
      productId: string;
      productName: string;
      expiryDate: string;
      remainingDays: number;
    }>;
  }>> {
    return fetchAPI('/dashboard/inventory-alerts', { method: 'GET' });
  }

  // Get order status distribution
  async getOrderStatusDistribution(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<Array<{
    status: string;
    count: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>>> {
    return fetchAPI(`/dashboard/order-status?period=${period}`, { method: 'GET' });
  }

  // Get payment method analytics
  async getPaymentAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<Array<{
    method: string;
    count: number;
    totalAmount: number;
    percentage: number;
  }>>> {
    return fetchAPI(`/dashboard/payment-analytics?period=${period}`, { method: 'GET' });
  }

  // Get delivery performance
  async getDeliveryPerformance(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    onTimeDeliveries: number;
    lateDeliveries: number;
    averageDeliveryTime: number;
    deliverySuccessRate: number;
    topDeliveryBoys: Array<{
      deliveryBoyId: string;
      name: string;
      totalDeliveries: number;
      onTimeRate: number;
      rating: number;
    }>;
  }>> {
    return fetchAPI(`/dashboard/delivery-performance?period=${period}`, { method: 'GET' });
  }

  // Get geographical sales data
  async getGeographicalSales(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<Array<{
    city: string;
    state: string;
    totalOrders: number;
    totalRevenue: number;
    customerCount: number;
  }>>> {
    return fetchAPI(`/dashboard/geographical-sales?period=${period}`, { method: 'GET' });
  }

  // Get hourly order patterns
  async getHourlyOrderPattern(days: number = 7): Promise<ApiResponse<Array<{
    hour: number;
    averageOrders: number;
    peakDay: string;
    totalOrders: number;
  }>>> {
    return fetchAPI(`/dashboard/hourly-pattern?days=${days}`, { method: 'GET' });
  }

  // Get customer behavior insights
  async getCustomerBehavior(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    averageOrderValue: number;
    averageOrderFrequency: number;
    popularShoppingTimes: Array<{
      hour: number;
      orderCount: number;
    }>;
    categoryPreferences: Array<{
      category: string;
      customerCount: number;
      averageSpend: number;
    }>;
    seasonalTrends: Array<{
      month: string;
      orderCount: number;
      revenue: number;
    }>;
  }>> {
    return fetchAPI(`/dashboard/customer-behavior?period=${period}`, { method: 'GET' });
  }

  // Get financial summary
  async getFinancialSummary(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalRevenue: number;
    totalProfit: number;
    totalExpenses: number;
    profitMargin: number;
    taxCollected: number;
    refundsIssued: number;
    revenueByCategory: Array<{
      category: string;
      revenue: number;
      profit: number;
    }>;
    monthlyComparison: {
      currentPeriod: number;
      previousPeriod: number;
      growthRate: number;
    };
  }>> {
    return fetchAPI(`/dashboard/financial-summary?period=${period}`, { method: 'GET' });
  }

  // Get promotional campaign performance
  async getCampaignPerformance(): Promise<ApiResponse<Array<{
    campaignId: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    totalOrders: number;
    totalRevenue: number;
    discountGiven: number;
    roi: number;
    conversionRate: number;
  }>>> {
    return fetchAPI('/dashboard/campaign-performance', { method: 'GET' });
  }

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<ApiResponse<{
    activeUsers: number;
    ordersToday: number;
    revenueToday: number;
    pendingOrders: number;
    outForDeliveryOrders: number;
    lowStockAlerts: number;
    customerSupportTickets: number;
    lastUpdateTime: string;
  }>> {
    return fetchAPI('/dashboard/real-time', { method: 'GET' });
  }

  // Export dashboard data
  async exportDashboardData(
    metrics: string[], 
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> {
    const params = new URLSearchParams({
      metrics: metrics.join(','),
      period,
      format,
    });

    const response = await fetch(`${API_BASE_URL}/dashboard/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Get custom date range analytics
  async getCustomAnalytics(
    startDate: string, 
    endDate: string, 
    metrics: string[]
  ): Promise<ApiResponse<any>> {
    return fetchAPI('/dashboard/custom-analytics', {
      method: 'POST',
      body: JSON.stringify({
        startDate,
        endDate,
        metrics,
      }),
    });
  }
}

export const dashboardAPI = new DashboardAPI();
export default dashboardAPI;
