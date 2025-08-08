import { baseRequest, fetchAPI } from './base';
import { ApiResponse, Product } from '@shared/api';

export interface ExportResponse {
  filename: string;
  downloadUrl: string;
  recordCount: number;
}

export interface ImportResponse {
  success: boolean;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

class ImportExportAPI {
  private readonly baseUrl = '/api';

  // Export Functions
  async exportProducts(filters?: any): Promise<ApiResponse<ExportResponse>> {
    return baseRequest<ExportResponse>(`${this.baseUrl}/products/export`, {
      method: 'POST',
      body: JSON.stringify({ filters }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async exportCategories(filters?: any): Promise<ApiResponse<ExportResponse>> {
    return baseRequest<ExportResponse>(`${this.baseUrl}/categories/export`, {
      method: 'POST',
      body: JSON.stringify({ filters }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async exportOrders(filters?: any): Promise<ApiResponse<ExportResponse>> {
    return baseRequest<ExportResponse>(`${this.baseUrl}/orders/export`, {
      method: 'POST',
      body: JSON.stringify({ filters }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // download
  async downloadProducts(): Promise<Response> {
    const API_BASE_URL = 'http://localhost:9090/api';
    const response = await fetch(`${API_BASE_URL}/products/excel/download`, {
      method: 'GET'
    });
    return response;
  }
  async downloadCategories(): Promise<Response> {
    const API_BASE_URL = 'http://localhost:9090/api';
    const response = await fetch(`${API_BASE_URL}/categories/excel/download`, {
      method: 'GET'
    });
    return response;
  }
  async downloadOrders(): Promise<Response> {
    const API_BASE_URL = 'http://localhost:9090/api';
    const response = await fetch(`${API_BASE_URL}/orders/excel/download`, {
      method: 'GET'
    });
    return response;
  }

  // Import Functions
  async importProducts(file: File): Promise<ApiResponse<ImportResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return baseRequest<ImportResponse>(`/products/excel/upload`, {
      method: 'POST',
      body: formData,
    });
  }

  async importCategories(file: File): Promise<ApiResponse<ImportResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return baseRequest<ImportResponse>(`/categories/excel/upload`, {
      method: 'POST',
      body: formData,
    });
  }

  async importOrders(file: File): Promise<ApiResponse<ImportResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return baseRequest<ImportResponse>(`/orders/excel/upload`, {
      method: 'POST',
      body: formData,
    });
  }

  // Template Downloads
  async downloadProductTemplate(): Promise<Response> {
    const API_BASE_URL = 'http://localhost:9090/api';
    const response = await fetch(`${API_BASE_URL}${this.baseUrl}/templates/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('adminToken')}`,
      },
    });
    return response;
  }

  async downloadCategoryTemplate(): Promise<Response> {
    const API_BASE_URL = 'http://localhost:9090/api';
    const response = await fetch(`${API_BASE_URL}${this.baseUrl}/templates/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('adminToken')}`,
      },
    });
    return response;
  }

  async downloadOrderTemplate(): Promise<Response> {
    const API_BASE_URL = 'http://localhost:9090/api';
    const response = await fetch(`${API_BASE_URL}${this.baseUrl}/templates/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('adminToken')}`,
      },
    });
    return response;
  }

  // Utility function to trigger file download
  downloadFile(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default new ImportExportAPI();
