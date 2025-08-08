import { ApiResponse } from '@shared/api';

const API_BASE_URL = 'http://localhost:9090/api';

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      return {
        success: false,
        error: {
          code: response.status.toString(),
          message: errorData.message || errorData.error || errorText || `HTTP error! status: ${response.status}`
        }
      };
    }

    const rawData = await response.json();
    
    // Check if response is already in ApiResponse format
    if (rawData && typeof rawData === 'object' && 'success' in rawData) {
      return rawData;
    }
    
    // Wrap raw data in ApiResponse format
    return {
      success: true,
      data: rawData
    };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error occurred'
      }
    };
  }
}

// Alias for backward compatibility
export const baseRequest = fetchAPI;

export { API_BASE_URL };
