package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    
    List<Category> getAllActiveCategories();
    
    Optional<Category> getCategoryById(String id);
    
    Optional<Category> getCategoryBySlug(String slug);
    
    List<Category> getParentCategories();
    
    List<Category> getSubCategories(String parentId);
    
    List<Category> searchCategories(String query);
    
    Category createCategory(Category category);
    
    Category updateCategory(String id, Category category);
    
    void deleteCategory(String id);
    
    Category activateCategory(String id);
    
    Category deactivateCategory(String id);
}
