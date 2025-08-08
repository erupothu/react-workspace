import { RequestHandler } from "express";
import { ApiResponse } from "@shared/api";

// Test endpoint to verify API connectivity
export const testAPIConnection: RequestHandler = (req, res) => {
  const response: ApiResponse<{ message: string; timestamp: string; backend: string }> = {
    success: true,
    data: {
      message: 'FreshMart API is working! Connection to Spring Boot backend established.',
      timestamp: new Date().toISOString(),
      backend: 'http://localhost:9090'
    }
  };
  
  res.json(response);
};

// Mock products endpoint for testing
export const getMockProducts: RequestHandler = (req, res) => {
  const mockProducts = [
    {
      id: "1",
      name: "Fresh Red Apples",
      description: "Premium quality fresh red apples from local orchards",
      price: 140,
      originalPrice: 160,
      categoryId: "fruits",
      unit: "1 Kg",
      stock: 50,
      image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      organic: true,
      featured: true,
      rating: 4.8,
      reviews: 124,
      status: "active" as const,
      tags: ["fresh", "organic", "local"],
      sku: "FRA001",
      minStock: 10,
      maxStock: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Heritage Toned Milk",
      description: "Fresh toned milk with essential nutrients",
      price: 65,
      originalPrice: 75,
      categoryId: "dairy",
      unit: "1L",
      stock: 30,
      image: "/placeholder.svg",
      images: ["/placeholder.svg"],
      organic: false,
      featured: false,
      rating: 4.6,
      reviews: 89,
      status: "active" as const,
      tags: ["fresh", "dairy"],
      sku: "HTM001",
      minStock: 15,
      maxStock: 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const response: ApiResponse<typeof mockProducts> = {
    success: true,
    data: mockProducts,
    pagination: {
      page: 1,
      limit: 10,
      total: mockProducts.length,
      totalPages: 1
    }
  };
  
  res.json(response);
};

// Mock dashboard stats for testing
export const getMockDashboardStats: RequestHandler = (req, res) => {
  const mockStats = {
    orders: {
      total: 1250,
      pending: 45,
      confirmed: 78,
      preparing: 32,
      outForDelivery: 23,
      delivered: 1050,
      cancelled: 22,
      todayOrders: 87,
      revenue: 125000,
      todayRevenue: 8500
    },
    products: {
      total: 450,
      active: 420,
      outOfStock: 15,
      lowStock: 25
    },
    customers: {
      total: 2840,
      active: 2650,
      newToday: 12,
      newThisMonth: 186
    },
    categories: {
      total: 24,
      active: 22
    }
  };

  const response: ApiResponse<typeof mockStats> = {
    success: true,
    data: mockStats
  };
  
  res.json(response);
};
