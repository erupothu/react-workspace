// Export all API services
export { default as productAPI } from './products';
export { default as categoryAPI } from './categories';
export { default as orderAPI } from './orders';
export { default as customerAPI } from './customers';
export { default as authAPI } from './auth';
export { default as dashboardAPI } from './dashboard';
export { default as imagesAPI } from './images';
export { default as importExportAPI } from './import-export';

// Export all API services as a single object
import productAPI from './products';
import categoryAPI from './categories';
import orderAPI from './orders';
import customerAPI from './customers';
import authAPI from './auth';
import dashboardAPI from './dashboard';
import imagesAPI from './images';
import importExportAPI from './import-export';

export const api = {
  products: productAPI,
  categories: categoryAPI,
  orders: orderAPI,
  customers: customerAPI,
  auth: authAPI,
  dashboard: dashboardAPI,
  images: imagesAPI,
  importExport: importExportAPI,
};

export default api;

// Utility function to setup API interceptors
export function setupAPIInterceptors() {
  // Setup automatic token refresh
  authAPI.setupAutoRefresh(15); // Refresh every 15 minutes
  
  // You can add global error handling here
  console.log('FreshMart API services initialized');
}

// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:9090/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};
