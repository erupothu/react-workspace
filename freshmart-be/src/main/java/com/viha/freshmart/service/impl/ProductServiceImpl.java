package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.Product;
import com.viha.freshmart.dao.repository.ProductRepository;
import com.viha.freshmart.service.core.ProductService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    @Override
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    @Override
    public Optional<Product> getProductBySku(String sku) {
        return productRepository.findBySku(sku);
    }

    @Override
    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandAndIsActiveTrue(brand);
    }

    @Override
    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }

    @Override
    public List<Product> getOrganicProducts() {
        return productRepository.findByIsOrganicTrueAndIsActiveTrue();
    }

    @Override
    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }

    @Override
    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findByStockQuantityLessThan(threshold);
    }

    @Override
    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product product) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isPresent()) {
            Product existing = existingProduct.get();
            existing.setName(product.getName());
            existing.setDescription(product.getDescription());
            existing.setPrice(product.getPrice());
            existing.setDiscountPrice(product.getDiscountPrice());
            existing.setStockQuantity(product.getStockQuantity());
            existing.setUnit(product.getUnit());
            existing.setBrand(product.getBrand());
            existing.setImages(product.getImages());
            existing.setMainImage(product.getMainImage());
            existing.setCategory(product.getCategory());
            existing.setNutritionInfo(product.getNutritionInfo());
            existing.setStorageInstructions(product.getStorageInstructions());
            existing.setExpiryDate(product.getExpiryDate());
            existing.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(existing);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public void deleteProduct(String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public Product activateProduct(String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setIsActive(true);
            product.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public Product deactivateProduct(String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setIsActive(false);
            product.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public Product updateStock(String id, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStockQuantity(quantity);
            product.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }
}
