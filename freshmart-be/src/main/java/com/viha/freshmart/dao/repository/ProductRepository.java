package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    
    List<Product> findByIsActiveTrue();
    
    List<Product> findByIsFeaturedTrue();
    
    List<Product> findByCategoryIdAndIsActiveTrue(String categoryId);
    
    List<Product> findByBrandAndIsActiveTrue(String brand);
    
    Optional<Product> findBySku(String sku);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    @Query("{'$or': [{'name': {$regex: ?0, $options: 'i'}}, {'description': {$regex: ?0, $options: 'i'}}], 'isActive': true}")
    List<Product> searchProducts(String searchTerm);
    
    List<Product> findByStockQuantityLessThan(Integer threshold);
    
    List<Product> findByIsOrganicTrueAndIsActiveTrue();
}
