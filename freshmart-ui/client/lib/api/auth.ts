import {
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AdminAuthRequest,
  AdminAuthResponse,
  AdminUser,
  Customer,
  ApiResponse
} from '@shared/api';
import { fetchAPI } from './base';

class AuthAPI {

  // Customer Authentication

  // Customer login
  async login(credentials: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens if login successful
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  // Customer registration
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store tokens if registration successful
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  // Customer logout
  async logout(): Promise<ApiResponse<void>> {
    const response = await fetchAPI<void>('/auth/logout', {
      method: 'POST',
    });

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    return response;
  }

  // Refresh authentication token
  async refreshToken(refreshToken?: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    const token = refreshToken || localStorage.getItem('refreshToken');
    if (!token) {
      throw new Error('No refresh token available');
    }

    const response = await fetchAPI<{ token: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
    });

    // Update stored tokens
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<Customer>> {
    return fetchAPI<Customer>('/auth/profile', { method: 'GET' });
  }

  // Update user profile
  async updateProfile(updates: Partial<Customer>): Promise<ApiResponse<Customer>> {
    const response = await fetchAPI<Customer>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    // Update local storage if successful
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  }

  // Change password
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return fetchAPI<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Forgot password
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Reset password
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Resend email verification
  async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
    });
  }

  // Admin Authentication

  // Admin login
  async adminLogin(credentials: AdminAuthRequest): Promise<ApiResponse<AdminAuthResponse>> {
    const response = await fetchAPI<AdminAuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store admin tokens if login successful
    if (response.success && response.data) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminRefreshToken', response.data.refreshToken);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
    }

    return response;
  }

  // Admin logout
  async adminLogout(): Promise<ApiResponse<void>> {
    const response = await fetchAPI<void>('/auth/admin/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });

    // Clear admin storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('admin');

    return response;
  }

  // Admin refresh token
  async adminRefreshToken(refreshToken?: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    const token = refreshToken || localStorage.getItem('adminRefreshToken');
    if (!token) {
      throw new Error('No admin refresh token available');
    }

    const response = await fetchAPI<{ token: string; refreshToken: string }>('/auth/admin/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
    });

    // Update stored admin tokens
    if (response.success && response.data) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminRefreshToken', response.data.refreshToken);
    }

    return response;
  }

  // Get admin profile
  async getAdminProfile(): Promise<ApiResponse<AdminUser>> {
    return fetchAPI<AdminUser>('/auth/admin/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
  }

  // Update admin profile
  async updateAdminProfile(updates: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> {
    const response = await fetchAPI<AdminUser>('/auth/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });

    // Update local storage if successful
    if (response.success && response.data) {
      localStorage.setItem('admin', JSON.stringify(response.data));
    }

    return response;
  }

  // Admin change password
  async adminChangePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return fetchAPI<void>('/auth/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
  }

  // Two-Factor Authentication

  // Enable 2FA
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; secret: string }>> {
    return fetchAPI<{ qrCode: string; secret: string }>('/auth/2fa/enable', {
      method: 'POST',
    });
  }

  // Verify and confirm 2FA setup
  async confirmTwoFactor(token: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return fetchAPI<{ backupCodes: string[] }>('/auth/2fa/confirm', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Disable 2FA
  async disableTwoFactor(token: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>('/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Verify 2FA token during login
  async verifyTwoFactor(token: string, tempToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchAPI<AuthResponse>('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ token, tempToken }),
    });

    // Store tokens if verification successful
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  // Social Authentication

  // Google OAuth
  async googleAuth(accessToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchAPI<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });

    // Store tokens if authentication successful
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  // Facebook OAuth
  async facebookAuth(accessToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchAPI<AuthResponse>('/auth/facebook', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });

    // Store tokens if authentication successful
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  // OTP Authentication

  // Send OTP to phone
  async sendOTP(phone: string): Promise<ApiResponse<{ message: string; tempToken: string }>> {
    return fetchAPI<{ message: string; tempToken: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  // Verify OTP
  async verifyOTP(phone: string, otp: string, tempToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetchAPI<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, tempToken }),
    });

    // Store tokens if verification successful
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  // Session Management

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Check if admin is authenticated
  isAdminAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  // Get stored user
  getStoredUser(): Customer | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Get stored admin
  getStoredAdmin(): AdminUser | null {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  // Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get admin token
  getAdminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  // Check token validity
  async checkTokenValidity(): Promise<ApiResponse<{ valid: boolean }>> {
    return fetchAPI<{ valid: boolean }>('/auth/verify-token', {
      method: 'GET',
    });
  }

  // Check admin token validity
  async checkAdminTokenValidity(): Promise<ApiResponse<{ valid: boolean }>> {
    return fetchAPI<{ valid: boolean }>('/auth/admin/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
  }

  // Get user sessions
  async getUserSessions(): Promise<ApiResponse<Array<{
    id: string;
    device: string;
    browser: string;
    ip: string;
    location: string;
    current: boolean;
    lastActivity: string;
  }>>> {
    return fetchAPI('/auth/sessions', { method: 'GET' });
  }

  // Revoke session
  async revokeSession(sessionId: string): Promise<ApiResponse<void>> {
    return fetchAPI<void>(`/auth/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Revoke all sessions except current
  async revokeAllSessions(): Promise<ApiResponse<void>> {
    return fetchAPI<void>('/auth/sessions/revoke-all', {
      method: 'POST',
    });
  }

  // Account Settings

  // Delete account
  async deleteAccount(password: string): Promise<ApiResponse<void>> {
    const response = await fetchAPI<void>('/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });

    // Clear local storage if account deleted
    if (response.success) {
      this.clearAllTokens();
    }

    return response;
  }

  // Clear all stored tokens
  clearAllTokens(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('admin');
  }

  // Auto refresh token before expiry
  async autoRefreshToken(): Promise<void> {
    try {
      const validity = await this.checkTokenValidity();
      if (!validity.data?.valid) {
        await this.refreshToken();
      }
    } catch (error) {
      console.warn('Auto refresh failed:', error);
      // Optionally redirect to login
    }
  }

  // Setup auto refresh interval (call this on app initialization)
  setupAutoRefresh(intervalMinutes: number = 15): void {
    setInterval(() => {
      if (this.isAuthenticated()) {
        this.autoRefreshToken();
      }
    }, intervalMinutes * 60 * 1000);
  }
}

export const authAPI = new AuthAPI();
export default authAPI;
