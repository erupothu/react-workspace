package com.viha.freshmart.dao.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String unit; // kg, piece, liter, etc.
    private String brand;
    private List<String> images;
    private String mainImage;
    private Double rating;
    private Integer reviewCount;
    private Boolean isActive;
    private Boolean isFeatured;
    private Boolean isOrganic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String nutritionInfo;
    private String storageInstructions;
    private LocalDateTime expiryDate;
    private String categoryId;
    private String subCategoryId;
    private String status;
    private List<String> tags;
    private String barcode;
    private String supplier;
    private String minStock;
    private String maxStock;
    
    @DBRef
    private Category category;

    public Product() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
        this.isFeatured = false;
        this.isOrganic = false;
        this.rating = 0.0;
        this.reviewCount = 0;
    }

    // Getters and Setters
    
    public String getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }



    public void setStatus(String status) {
        this.status = status;
    }



    public List<String> getTags() {
        return tags;
    }



    public void setTags(List<String> tags) {
        this.tags = tags;
    }



    public String getBarcode() {
        return barcode;
    }



    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }



    public String getSupplier() {
        return supplier;
    }



    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }



    public String getMinStock() {
        return minStock;
    }



    public void setMinStock(String minStock) {
        this.minStock = minStock;
    }



    public String getMaxStock() {
        return maxStock;
    }



    public void setMaxStock(String maxStock) {
        this.maxStock = maxStock;
    }



    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public Boolean getIsOrganic() {
        return isOrganic;
    }

    public void setIsOrganic(Boolean isOrganic) {
        this.isOrganic = isOrganic;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getNutritionInfo() {
        return nutritionInfo;
    }

    public void setNutritionInfo(String nutritionInfo) {
        this.nutritionInfo = nutritionInfo;
    }

    public String getStorageInstructions() {
        return storageInstructions;
    }

    public void setStorageInstructions(String storageInstructions) {
        this.storageInstructions = storageInstructions;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }



    public String getCategoryId() {
        return categoryId;
    }



    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(String subCategoryId) {
        this.subCategoryId = subCategoryId;
    }
}
