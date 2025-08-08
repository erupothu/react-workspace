import { baseRequest } from './base';
import { ApiResponse, UploadResponse } from '@shared/api';

class ImagesAPI {
  private readonly baseUrl = '/images';

  /**
   * Upload single image
   */
  async uploadImage(file: File, category, createdBy): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('uploadedBy', createdBy);

    return baseRequest<UploadResponse>(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser set it for FormData
      headers: {
        // Remove Content-Type to let browser handle FormData boundary
      },
    });
  }

  /**
   * Upload multiple images
   */
  async uploadImages(files: File[]): Promise<ApiResponse<UploadResponse[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    return baseRequest<UploadResponse[]>(`${this.baseUrl}/upload/multiple`, {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Delete image by filename
   */
  async deleteImage(filename: string): Promise<ApiResponse<{ success: boolean }>> {
    return baseRequest<{ success: boolean }>(`${this.baseUrl}/${filename}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get image URL by filename
   */
  getImageUrl(filename: string): string {
    // Assuming images are served from /api/images/serve/{filename}
    return `${this.baseUrl}/serve/${filename}`;
  }

  /**
   * Get thumbnail URL by filename
   */
  getThumbnailUrl(filename: string): string {
    return `${this.baseUrl}/serve/thumb/${filename}`;
  }
}

export default new ImagesAPI();
