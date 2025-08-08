package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Image;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ImageService {
    
    /**
     * Upload and save image
     */
    Image uploadImage(MultipartFile file, String category, String uploadedBy, String description, String altText);
    
    /**
     * Get image by ID
     */
    Optional<Image> getImageById(String imageId);
    
    /**
     * Get image file resource by ID
     */
    Resource getImageResource(String imageId);
    
    /**
     * Get image resource by size
     */
    Resource getImageResourceBySize(String imageId, String size);
    
    /**
     * Get images by category
     */
    List<Image> getImagesByCategory(String category);
    
    /**
     * Get images by category and size
     */
    List<Image> getImagesByCategoryAndSize(String category, String size);
    
    /**
     * Search images by keyword
     */
    List<Image> searchImages(String keyword);
    
    /**
     * Get images uploaded by user
     */
    List<Image> getImagesByUploadedBy(String uploadedBy);
    
    /**
     * Update image metadata
     */
    Image updateImageMetadata(String imageId, String description, String altText, String category);
    
    /**
     * Delete image (soft delete)
     */
    boolean deleteImage(String imageId);
    
    /**
     * Get image URL
     */
    String getImageUrl(String imageId);
    
    /**
     * Get image URL by size
     */
    String getImageUrlBySize(String imageId, String size);
    
    /**
     * Get all active images
     */
    List<Image> getAllActiveImages();
    
    /**
     * Get image count by category
     */
    long getImageCountByCategory(String category);
    
    /**
     * Generate thumbnail for image
     */
    boolean generateThumbnails(String imageId);
}
