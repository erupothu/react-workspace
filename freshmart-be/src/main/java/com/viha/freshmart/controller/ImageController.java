package com.viha.freshmart.controller;

import com.viha.freshmart.dao.entity.Image;
import com.viha.freshmart.service.core.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
@Tag(name = "Images", description = "Image upload and management API")
public class ImageController {
    
    @Autowired
    private ImageService imageService;
    
    /**
     * Upload image with category and metadata
     * POST /api/images/upload
     */
    @Operation(
        summary = "Upload an image",
        description = "Upload an image file with metadata including category, description, and alt text",
        responses = {
            @ApiResponse(responseCode = "201", description = "Image uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or parameters")
        }
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @Parameter(description = "Image file to upload", required = true)
            @RequestParam("file") MultipartFile file,

            @Parameter(description = "Image category (e.g., product, profile, banner)", required = true, example = "product")
            @RequestParam("category") String category,

            @Parameter(description = "User ID who uploaded the image", required = false, example = "user123")
            @RequestParam(value = "uploadedBy", required = false, defaultValue = "anonymous") String uploadedBy,

            @Parameter(description = "Image description", required = false, example = "Product main image")
            @RequestParam(value = "description", required = false) String description,

            @Parameter(description = "Alternative text for accessibility", required = false, example = "Fresh red apples")
            @RequestParam(value = "altText", required = false) String altText) {
        
        try {
            Image savedImage = imageService.uploadImage(file, category, uploadedBy, description, altText);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image uploaded successfully");
            response.put("data", savedImage);
            response.put("imageUrl", imageService.getImageUrl(savedImage.getId()));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to upload image: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Get image by ID with optional size parameter
     * GET /api/images/{imageId}?size=thumbnail|medium|large|original
     */
    @Operation(
        summary = "Get image by ID",
        description = "Retrieve an image file by its ID with optional size parameter",
        responses = {
            @ApiResponse(responseCode = "200", description = "Image retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Image not found")
        }
    )
    @GetMapping("/{imageId}")
    public ResponseEntity<Resource> getImage(
            @Parameter(description = "Image ID", required = true, example = "64a1b2c3d4e5f6789012345")
            @PathVariable String imageId,

            @Parameter(description = "Image size", required = false, example = "thumbnail",
                      schema = @Schema(allowableValues = {"original", "thumbnail", "medium", "large"}))
            @RequestParam(value = "size", required = false, defaultValue = "original") String size) {
        
        try {
            Resource resource;
            if ("original".equalsIgnoreCase(size)) {
                resource = imageService.getImageResource(imageId);
            } else {
                resource = imageService.getImageResourceBySize(imageId, size);
            }
            
            // Get image metadata for content type
            Optional<Image> imageOpt = imageService.getImageById(imageId);
            String contentType = imageOpt.map(Image::getContentType).orElse("application/octet-stream");
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get image metadata by ID
     * GET /api/images/{imageId}/metadata
     */
    @GetMapping("/{imageId}/metadata")
    public ResponseEntity<?> getImageMetadata(@PathVariable String imageId) {
        try {
            Optional<Image> imageOpt = imageService.getImageById(imageId);
            if (imageOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", imageOpt.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Image not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving image metadata: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get images by category with optional size filter
     * GET /api/images/category/{category}?size=thumbnail|medium|large
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getImagesByCategory(
            @PathVariable String category,
            @RequestParam(value = "size", required = false) String size) {
        
        try {
            List<Image> images;
            if (size != null && !size.isEmpty()) {
                images = imageService.getImagesByCategoryAndSize(category, size);
            } else {
                images = imageService.getImagesByCategory(category);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", images);
            response.put("count", images.size());
            response.put("category", category);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Search images by keyword
     * GET /api/images/search?keyword={keyword}
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchImages(@RequestParam String keyword) {
        try {
            List<Image> images = imageService.searchImages(keyword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", images);
            response.put("count", images.size());
            response.put("keyword", keyword);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error searching images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get all images with pagination support
     * GET /api/images/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllImages() {
        try {
            List<Image> images = imageService.getAllActiveImages();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", images);
            response.put("count", images.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get images uploaded by specific user
     * GET /api/images/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getImagesByUser(@PathVariable String userId) {
        try {
            List<Image> images = imageService.getImagesByUploadedBy(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", images);
            response.put("count", images.size());
            response.put("uploadedBy", userId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Update image metadata
     * PUT /api/images/{imageId}/metadata
     */
    @PutMapping("/{imageId}/metadata")
    public ResponseEntity<?> updateImageMetadata(
            @PathVariable String imageId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "category", required = false) String category) {
        
        try {
            Image updatedImage = imageService.updateImageMetadata(imageId, description, altText, category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image metadata updated successfully");
            response.put("data", updatedImage);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update image metadata: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Delete image (soft delete)
     * DELETE /api/images/{imageId}
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable String imageId) {
        try {
            boolean deleted = imageService.deleteImage(imageId);
            
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("success", true);
                response.put("message", "Image deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Image not found");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get image statistics by category
     * GET /api/images/stats/category/{category}
     */
    @GetMapping("/stats/category/{category}")
    public ResponseEntity<?> getImageStatsByCategory(@PathVariable String category) {
        try {
            long count = imageService.getImageCountByCategory(category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            response.put("count", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Generate thumbnails for existing image
     * POST /api/images/{imageId}/thumbnails
     */
    @PostMapping("/{imageId}/thumbnails")
    public ResponseEntity<?> generateThumbnails(@PathVariable String imageId) {
        try {
            boolean success = imageService.generateThumbnails(imageId);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "Thumbnails generated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to generate thumbnails");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error generating thumbnails: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
