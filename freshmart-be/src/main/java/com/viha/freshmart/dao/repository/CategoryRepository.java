package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    List<Category> findByIsActiveTrueOrderBySortOrderAsc();
    
    List<Category> findByParentCategoryIdIsNullAndIsActiveTrueOrderBySortOrderAsc();
    
    List<Category> findByParentCategoryIdAndIsActiveTrueOrderBySortOrderAsc(String parentCategoryId);
    
    Optional<Category> findBySlug(String slug);
    
    List<Category> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
}
