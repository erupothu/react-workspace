// import { Category } from '@shared/api';
/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Base API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: Category;
  subcategory: Category;
  categoryId: string;
  subcategoryId?: string;
  subCategoryId?: string;
  unit: string;
  stock: number;
  image: string;
  images: string[];
  isOrganic: boolean;
  isFeatured: boolean;
  rating: number;
  reviews: number;
  status: "active" | "inactive" | "out_of_stock";
  isActive: boolean;
  tags: string[];
  sku: string;
  barcode?: string;
  supplierId?: string;
  minStock: number;
  maxStock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  subcategoryId?: string;
  unit: string;
  stock: number;
  image?: string;
  images?: string[];
  organic?: boolean;
  featured?: boolean;
  tags?: string[];
  sku: string;
  barcode?: string;
  supplierId?: string;
  minStock?: number;
  maxStock?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductSearchParams {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  status?: Product["status"];
  organic?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "name" | "price" | "rating" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  parentId: string | null;
  parentCategoryId: string | null;
  slug: string;
  status: "active" | "inactive";
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  subCategories: Category[];
  metadata: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  icon?: string;
  color?: string;
  image?: string;
  parentId?: string | null;
  slug: string;
  sortOrder?: number;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "blocked";
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  loyaltyPoints: number;
  addresses: Array<{
    id: string;
    type: String;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
  }>;
  notes: string;
  tags: string[];
  lastOrderDate?: string;
  segment: "new" | "regular" | "vip" | "inactive";
}

export interface Address {
  id: string;
  customerId: string;
  type: "home" | "work" | "other";
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  fullAddress: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth?: string;
  isActive: boolean;
  gender?: string;
}

export interface UpdateCustomerRequest {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    currency?: string;
  };
}

export interface CustomerSearchParams {
  query?: string;
  status?: Customer["status"];
  minTotalSpent?: number;
  maxTotalSpent?: number;
  minOrders?: number;
  registeredAfter?: string;
  registeredBefore?: string;
  city?: string;
  state?: string;
  sortBy?: "firstName" | "email" | "totalSpent" | "totalOrders" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  items: OrderItem[];
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cash" | "card" | "upi" | "wallet" | "bank_transfer";
  paymentId?: string;
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  deliveryAddress: Address;
  billingAddress?: Address;
  deliverySlot: {
    date: string;
    timeSlot: string;
  };
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  trackingId?: string;
  assignedDeliveryBoyId?: string;
  deliveryBoy?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  priority?: boolean;
  cancellationReason?: string;
  refundAmount?: number;
  refundId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  originalPrice: number;
  total: number;
  unit: string;
  specifications?: {
    weight?: number;
    variant?: string;
    notes?: string;
  };
}

export interface CreateOrderRequest {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    specifications?: {
      weight?: number;
      variant?: string;
      notes?: string;
    };
  }[];
  deliveryAddressId: string;
  billingAddressId?: string;
  deliverySlot: {
    date: string;
    timeSlot: string;
  };
  paymentMethod: Order["paymentMethod"];
  couponCode?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  id: string;
  status?: Order["status"];
  paymentStatus?: Order["paymentStatus"];
  trackingId?: string;
  assignedDeliveryBoyId?: string;
  actualDelivery?: string;
  cancellationReason?: string;
  notes?: string;
}

export interface OrderSearchParams {
  customerId?: string;
  status?: Order["status"];
  paymentStatus?: Order["paymentStatus"];
  orderNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
  city?: string;
  assignedDeliveryBoyId?: string;
  sortBy?: "orderNumber" | "total" | "createdAt" | "estimatedDelivery";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Authentication Types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: Customer;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "admin" | "manager" | "staff";
  permissions: string[];
  avatar?: string;
  status: "active" | "inactive";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthRequest {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  admin: AdminUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Dashboard & Analytics Types
export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    outForDelivery: number;
    delivered: number;
    cancelled: number;
    todayOrders: number;
    revenue: number;
    todayRevenue: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
  };
  customers: {
    total: number;
    active: number;
    newToday: number;
    newThisMonth: number;
  };
  categories: {
    total: number;
    active: number;
  };
}

export interface SalesAnalytics {
  period: "day" | "week" | "month" | "year";
  data: {
    date: string;
    sales: number;
    orders: number;
    avgOrderValue: number;
  }[];
}

// Inventory Types
export interface StockAlert {
  id: string;
  productId: string;
  product?: Product;
  type: "low_stock" | "out_of_stock" | "expiring_soon";
  currentStock: number;
  threshold: number;
  severity: "low" | "medium" | "high" | "critical";
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  product?: Product;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: "purchase" | "sale" | "return" | "damage" | "adjustment" | "transfer";
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  paymentTerms: string;
  status: "active" | "inactive";
  rating: number;
  totalSupplied: number;
  createdAt: string;
  updatedAt: string;
}

// Delivery Boy Types
export interface DeliveryBoy {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleType: "bike" | "bicycle" | "car" | "van";
  vehicleNumber: string;
  licenseNumber?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
  status: "available" | "busy" | "offline";
  totalDeliveries: number;
  rating: number;
  currentOrders: string[];
  createdAt: string;
  updatedAt: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validTill: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  status: "active" | "inactive" | "expired";
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  product?: Product;
  customerId: string;
  customer?: Customer;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  userType: "customer" | "admin" | "delivery_boy";
  type: "order_update" | "promotion" | "stock_alert" | "payment" | "general";
  title: string;
  message: string;
  data?: any;
  channels: ("email" | "sms" | "push" | "in_app")[];
  status: "pending" | "sent" | "failed";
  readAt?: string;
  createdAt: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Common pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Common response metadata
export interface ResponseMetadata {
  timestamp: string;
  requestId?: string;
  version: string;
}

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

export interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}
