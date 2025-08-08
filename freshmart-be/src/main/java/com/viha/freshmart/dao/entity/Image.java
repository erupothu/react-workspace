package com.viha.freshmart.dao.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "images")
public class Image {
    
    @Id
    private String id;
    
    @Indexed
    private String fileName;
    
    private String originalName;
    
    @Indexed
    private String category;
    
    private Long fileSize;
    
    private String contentType;
    
    private String filePath;
    
    private String url;
    
    private String description;
    
    private String altText;
    
    @Indexed
    private String uploadedBy;
    
    private LocalDateTime uploadedAt;
    
    private LocalDateTime updatedAt;
    
    private boolean isActive;
    
    // Image dimensions
    private Integer width;
    private Integer height;
    
    // Thumbnails or different sizes
    private String thumbnailPath;
    private String mediumPath;
    private String largePath;
    
    public Image() {
        this.uploadedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    public Image(String fileName, String originalName, String category, Long fileSize, 
                String contentType, String filePath, String uploadedBy) {
        this();
        this.fileName = fileName;
        this.originalName = originalName;
        this.category = category;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.filePath = filePath;
        this.uploadedBy = uploadedBy;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getOriginalName() {
        return originalName;
    }
    
    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getAltText() {
        return altText;
    }
    
    public void setAltText(String altText) {
        this.altText = altText;
    }
    
    public String getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public Integer getWidth() {
        return width;
    }
    
    public void setWidth(Integer width) {
        this.width = width;
    }
    
    public Integer getHeight() {
        return height;
    }
    
    public void setHeight(Integer height) {
        this.height = height;
    }
    
    public String getThumbnailPath() {
        return thumbnailPath;
    }
    
    public void setThumbnailPath(String thumbnailPath) {
        this.thumbnailPath = thumbnailPath;
    }
    
    public String getMediumPath() {
        return mediumPath;
    }
    
    public void setMediumPath(String mediumPath) {
        this.mediumPath = mediumPath;
    }
    
    public String getLargePath() {
        return largePath;
    }
    
    public void setLargePath(String largePath) {
        this.largePath = largePath;
    }
    
    @Override
    public String toString() {
        return "Image{" +
                "id='" + id + '\'' +
                ", fileName='" + fileName + '\'' +
                ", originalName='" + originalName + '\'' +
                ", category='" + category + '\'' +
                ", fileSize=" + fileSize +
                ", contentType='" + contentType + '\'' +
                ", uploadedAt=" + uploadedAt +
                ", isActive=" + isActive +
                '}';
    }
}
