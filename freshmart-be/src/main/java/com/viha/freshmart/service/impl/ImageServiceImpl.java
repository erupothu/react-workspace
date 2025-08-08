package com.viha.freshmart.service.impl;

import com.viha.freshmart.dao.entity.Image;
import com.viha.freshmart.dao.repository.ImageRepository;
import com.viha.freshmart.service.core.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {
    
    @Autowired
    private ImageRepository imageRepository;
    
    @Value("${app.image.upload.dir:uploads/images}")
    private String uploadDir;
    
    @Value("${app.image.base.url:http://localhost:9090/api/images}")
    private String baseImageUrl;
    
    private final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"};
    private final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    
    @Override
    public Image uploadImage(MultipartFile file, String category, String uploadedBy, 
                           String description, String altText) {
        
        validateFile(file);
        
        try {
            // Create upload directory if not exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
            
            // Save the file
            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Set default dimensions for now
            Integer width = null;
            Integer height = null;
            
            // Create image entity
            Image image = new Image(
                uniqueFilename,
                originalFilename,
                category,
                file.getSize(),
                file.getContentType(),
                targetLocation.toString(),
                uploadedBy
            );
            
            image.setDescription(description);
            image.setAltText(altText);
            image.setWidth(width);
            image.setHeight(height);
            image.setUrl(baseImageUrl + "/" + image.getId());
            
            // Save to database
            Image savedImage = imageRepository.save(image);
            
            // Generate thumbnails
            generateThumbnails(savedImage.getId());
            image.setUrl(getImageUrl(savedImage.getId()));
            
            return savedImage;
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename() + 
                                     ". Please try again!", ex);
        }
    }
    
    @Override
    public Optional<Image> getImageById(String imageId) {
        return imageRepository.findByIdAndIsActiveTrue(imageId);
    }
    
    @Override
    public Resource getImageResource(String imageId) {
        Optional<Image> imageOpt = getImageById(imageId);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            return loadFileAsResource(image.getFilePath());
        }
        throw new RuntimeException("Image not found with id: " + imageId);
    }
    
    @Override
    public Resource getImageResourceBySize(String imageId, String size) {
        Optional<Image> imageOpt = getImageById(imageId);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            String filePath = getPathBySize(image, size);
            return loadFileAsResource(filePath);
        }
        throw new RuntimeException("Image not found with id: " + imageId);
    }
    
    @Override
    public List<Image> getImagesByCategory(String category) {
        return imageRepository.findByCategoryAndIsActiveTrueOrderByUploadedAtDesc(category);
    }
    
    @Override
    public List<Image> getImagesByCategoryAndSize(String category, String size) {
        // For now, return all images by category. Size filtering is handled at URL level
        return getImagesByCategory(category);
    }
    
    @Override
    public List<Image> searchImages(String keyword) {
        return imageRepository.searchByKeyword(keyword);
    }
    
    @Override
    public List<Image> getImagesByUploadedBy(String uploadedBy) {
        return imageRepository.findByUploadedByAndIsActiveTrueOrderByUploadedAtDesc(uploadedBy);
    }
    
    @Override
    public Image updateImageMetadata(String imageId, String description, String altText, String category) {
        Optional<Image> imageOpt = getImageById(imageId);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            if (description != null) image.setDescription(description);
            if (altText != null) image.setAltText(altText);
            if (category != null) image.setCategory(category);
            image.setUpdatedAt(LocalDateTime.now());
            return imageRepository.save(image);
        }
        throw new RuntimeException("Image not found with id: " + imageId);
    }
    
    @Override
    public boolean deleteImage(String imageId) {
        Optional<Image> imageOpt = getImageById(imageId);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            image.setActive(false);
            image.setUpdatedAt(LocalDateTime.now());
            imageRepository.save(image);
            return true;
        }
        return false;
    }
    
    @Override
    public String getImageUrl(String imageId) {
        return baseImageUrl + "/" + imageId;
    }
    
    @Override
    public String getImageUrlBySize(String imageId, String size) {
        return baseImageUrl + "/" + imageId + "?size=" + size;
    }
    
    @Override
    public List<Image> getAllActiveImages() {
        return imageRepository.findAllByIsActiveTrueOrderByUploadedAtDesc();
    }
    
    @Override
    public long getImageCountByCategory(String category) {
        return imageRepository.countByCategoryAndIsActiveTrue(category);
    }
    
    @Override
    public boolean generateThumbnails(String imageId) {
        // Simplified implementation - placeholder for future thumbnail generation
        Optional<Image> imageOpt = getImageById(imageId);
        if (imageOpt.isPresent()) {
            Image image = imageOpt.get();
            // For now, just set paths to the original file
            image.setThumbnailPath(image.getFilePath());
            image.setMediumPath(image.getFilePath());
            image.setLargePath(image.getFilePath());
            imageRepository.save(image);
            return true;
        }
        return false;
    }
    
    // Helper methods
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum allowed size of " + MAX_FILE_SIZE + " bytes");
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || !isValidFileExtension(filename)) {
            throw new RuntimeException("Invalid file type. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
    }
    
    private boolean isValidFileExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (allowedExt.equals(extension)) {
                return true;
            }
        }
        return false;
    }
    
    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
    
    private Resource loadFileAsResource(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + filePath);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + filePath, ex);
        }
    }
    
    private String getPathBySize(Image image, String size) {
        switch (size.toLowerCase()) {
            case "thumb":
            case "thumbnail":
                return image.getThumbnailPath() != null ? image.getThumbnailPath() : image.getFilePath();
            case "medium":
                return image.getMediumPath() != null ? image.getMediumPath() : image.getFilePath();
            case "large":
                return image.getLargePath() != null ? image.getLargePath() : image.getFilePath();
            default:
                return image.getFilePath();
        }
    }
    

}
