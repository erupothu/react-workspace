package com.viha.freshmart.dao.repository;

import com.viha.freshmart.dao.entity.Image;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends MongoRepository<Image, String> {
    
    /**
     * Find active image by ID
     */
    Optional<Image> findByIdAndIsActiveTrue(String id);
    
    /**
     * Find images by category
     */
    List<Image> findByCategoryAndIsActiveTrueOrderByUploadedAtDesc(String category);
    
    /**
     * Find images by filename
     */
    Optional<Image> findByFileNameAndIsActiveTrue(String fileName);
    
    /**
     * Find images uploaded by specific user
     */
    List<Image> findByUploadedByAndIsActiveTrueOrderByUploadedAtDesc(String uploadedBy);
    
    /**
     * Find images by content type
     */
    List<Image> findByContentTypeAndIsActiveTrueOrderByUploadedAtDesc(String contentType);
    
    /**
     * Search images by original name or description
     */
    @Query("{'$and': [" +
           "{'isActive': true}, " +
           "{'$or': [" +
           "{'originalName': {'$regex': ?0, '$options': 'i'}}, " +
           "{'description': {'$regex': ?0, '$options': 'i'}}, " +
           "{'altText': {'$regex': ?0, '$options': 'i'}}" +
           "]}" +
           "]}")
    List<Image> searchByKeyword(String keyword);
    
    /**
     * Find images by category and content type
     */
    List<Image> findByCategoryAndContentTypeAndIsActiveTrueOrderByUploadedAtDesc(
            String category, String contentType);
    
    /**
     * Find images by file size range
     */
    @Query("{'$and': [" +
           "{'isActive': true}, " +
           "{'fileSize': {'$gte': ?0, '$lte': ?1}}" +
           "]}")
    List<Image> findByFileSizeRange(Long minSize, Long maxSize);
    
    /**
     * Count images by category
     */
    long countByCategoryAndIsActiveTrue(String category);
    
    /**
     * Count images uploaded by user
     */
    long countByUploadedByAndIsActiveTrue(String uploadedBy);
    
    /**
     * Find all active images with pagination support
     */
    List<Image> findAllByIsActiveTrueOrderByUploadedAtDesc();
}
