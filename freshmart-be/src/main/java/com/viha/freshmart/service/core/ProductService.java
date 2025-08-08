package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    
    List<Product> getAllActiveProducts();
    
    Optional<Product> getProductById(String id);
    
    Optional<Product> getProductBySku(String sku);
    
    List<Product> getProductsByCategory(String categoryId);
    
    List<Product> getProductsByBrand(String brand);
    
    List<Product> getFeaturedProducts();
    
    List<Product> getOrganicProducts();
    
    List<Product> searchProducts(String query);
    
    List<Product> getLowStockProducts(Integer threshold);
    
    Product createProduct(Product product);
    
    Product updateProduct(String id, Product product);
    
    void deleteProduct(String id);
    
    Product activateProduct(String id);
    
    Product deactivateProduct(String id);
    
    Product updateStock(String id, Integer quantity);
}
