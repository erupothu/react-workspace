import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiResponse
} from '@shared/api';
import { API_BASE_URL, fetchAPI } from './base';

class CategoryAPI {

  // Get all categories with hierarchy
  async getCategories(includeInactive: boolean = false): Promise<ApiResponse<Category[]>> {
    const endpoint = `/categories${includeInactive ? '?includeInactive=true' : ''}`;
    return fetchAPI<Category[]>(endpoint, { method: 'GET' });
  }

  // Get flat list of all categories (no hierarchy)
  async getFlatCategories(includeInactive: boolean = false): Promise<ApiResponse<Category[]>> {
    const endpoint = `/categories/flat${includeInactive ? '?includeInactive=true' : ''}`;
    return fetchAPI<Category[]>(endpoint, { method: 'GET' });
  }

  // Get a single category by ID
  async getCategory(id: string): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/${id}`, { method: 'GET' });
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/slug/${slug}`, { method: 'GET' });
  }

  // Create a new category
  async createCategory(category: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  // Update an existing category
  async updateCategory(id: string, category: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  // Partially update a category
  async patchCategory(id: string, updates: Partial<Category>): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Delete a category
  async deleteCategory(id: string, moveProductsTo?: string): Promise<ApiResponse<void>> {
    const body = moveProductsTo ? JSON.stringify({ moveProductsTo }) : undefined;
    return fetchAPI<void>(`/categories/${id}`, { 
      method: 'DELETE',
      body,
    });
  }

  // Get top-level categories only
  async getRootCategories(): Promise<ApiResponse<Category[]>> {
    return fetchAPI<Category[]>('/categories/root', { method: 'GET' });
  }

  // Get subcategories of a parent category
  async getSubcategories(parentId: string): Promise<ApiResponse<Category[]>> {
    return fetchAPI<Category[]>(`/categories/${parentId}/subcategories`, { method: 'GET' });
  }

  // Update category sort order
  async updateCategorySortOrder(updates: { id: string; sortOrder: number }[]): Promise<ApiResponse<void>> {
    return fetchAPI<void>('/categories/sort-order', {
      method: 'PATCH',
      body: JSON.stringify({ updates }),
    });
  }

  // Move category to different parent
  async moveCategory(id: string, newParentId: string | null): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ parentId: newParentId }),
    });
  }

  // Update category status
  async updateCategoryStatus(id: string, status: Category['status']): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Bulk update categories
  async bulkUpdateCategories(updates: { id: string; updates: Partial<Category> }[]): Promise<ApiResponse<Category[]>> {
    return fetchAPI<Category[]>('/categories/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates }),
    });
  }

  // Bulk delete categories
  async bulkDeleteCategories(ids: string[], moveProductsTo?: string): Promise<ApiResponse<void>> {
    const body = { ids, moveProductsTo };
    return fetchAPI<void>('/categories/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify(body),
    });
  }

  // Search categories
  async searchCategories(query: string): Promise<ApiResponse<Category[]>> {
    const searchParams = new URLSearchParams({ query });
    return fetchAPI<Category[]>(`/categories/search?${searchParams.toString()}`, { method: 'GET' });
  }

  // Get category tree (for dropdown/picker components)
  async getCategoryTree(): Promise<ApiResponse<Category[]>> {
    return fetchAPI<Category[]>('/categories/tree', { method: 'GET' });
  }

  // Get category breadcrumb path
  async getCategoryPath(id: string): Promise<ApiResponse<Category[]>> {
    return fetchAPI<Category[]>(`/categories/${id}/path`, { method: 'GET' });
  }

  // Upload category image
  async uploadCategoryImage(id: string, file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('image', file);

    return fetchAPI<string>(`/categories/${id}/image`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Delete category image
  async deleteCategoryImage(id: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/categories/${id}/image`, {
      method: 'DELETE',
    });
  }

  // Get category analytics
  async getCategoryAnalytics(id: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    productCount: number;
    totalSales: number;
    totalOrders: number;
    popularProducts: Array<{
      productId: string;
      productName: string;
      sales: number;
      orders: number;
    }>;
    salesTrend: Array<{
      date: string;
      sales: number;
      orders: number;
    }>;
  }>> {
    return fetchAPI(`/categories/${id}/analytics?period=${period}`, { method: 'GET' });
  }

  // Get category statistics
  async getCategoryStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    withProducts: number;
    withoutProducts: number;
    byLevel: { level: number; count: number }[];
    productDistribution: { categoryId: string; categoryName: string; productCount: number }[];
  }>> {
    return fetchAPI('/categories/stats', { method: 'GET' });
  }

  // Check category slug availability
  async checkSlugAvailability(slug: string, excludeId?: string): Promise<ApiResponse<{ available: boolean }>> {
    const params = new URLSearchParams({ slug });
    if (excludeId) params.append('excludeId', excludeId);
    
    return fetchAPI(`/categories/check-slug?${params.toString()}`, { method: 'GET' });
  }

  // Generate category slug from name
  async generateSlug(name: string): Promise<ApiResponse<{ slug: string }>> {
    return fetchAPI('/categories/generate-slug', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  // Import categories from file
  async importCategories(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    return fetchAPI<{ imported: number; errors: string[] }>('/categories/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  }

  // Export categories
  async exportCategories(format: 'csv' | 'excel' | 'json' = 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/categories/export?format=${format}`, {
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

  // Get categories for navigation menu
  async getNavigationCategories(maxDepth: number = 2): Promise<ApiResponse<Category[]>> {
    return fetchAPI<Category[]>(`/categories/navigation?maxDepth=${maxDepth}`, { method: 'GET' });
  }

  // Get popular categories (based on product sales/views)
  async getPopularCategories(limit: number = 10, period: 'day' | 'week' | 'month' = 'month'): Promise<ApiResponse<Array<Category & { popularity: number }>>> {
    return fetchAPI(`/categories/popular?limit=${limit}&period=${period}`, { method: 'GET' });
  }

  // Duplicate category
  async duplicateCategory(id: string, newName: string, newSlug: string): Promise<ApiResponse<Category>> {
    return fetchAPI<Category>(`/categories/${id}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ name: newName, slug: newSlug }),
    });
  }

  // Merge categories (move all products from source to target and delete source)
  async mergeCategories(sourceId: string, targetId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/categories/${sourceId}/merge`, {
      method: 'POST',
      body: JSON.stringify({ targetId }),
    });
  }
}

export const categoryAPI = new CategoryAPI();
export default categoryAPI;
