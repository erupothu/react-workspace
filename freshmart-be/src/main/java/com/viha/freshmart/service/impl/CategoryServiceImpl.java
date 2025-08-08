package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.Category;
import com.viha.freshmart.dao.repository.CategoryRepository;
import com.viha.freshmart.service.core.CategoryService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllActiveCategories() {
        List<Category> response = new ArrayList<>();
        List<Category> categories = categoryRepository.findByIsActiveTrueOrderBySortOrderAsc();
        for(Category cat: categories) {
            if(cat.getParentCategoryId().isEmpty()) {
                cat.setSubCategory(getSubCategories(cat.getId()));
                response.add(cat);
            }
        }
        return response;
    }

    @Override
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Optional<Category> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    @Override
    public List<Category> getParentCategories() {
        return categoryRepository.findByParentCategoryIdIsNullAndIsActiveTrueOrderBySortOrderAsc();
    }

    @Override
    public List<Category> getSubCategories(String parentId) {
        return categoryRepository.findByParentCategoryIdAndIsActiveTrueOrderBySortOrderAsc(parentId);
    }

    @Override
    public List<Category> searchCategories(String query) {
        return categoryRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query);
    }

    @Override
    public Category createCategory(Category category) {
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(String id, Category category) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            Category existing = existingCategory.get();
            existing.setName(category.getName());
            existing.setDescription(category.getDescription());
            existing.setSlug(category.getSlug());
            existing.setImage(category.getImage());
            existing.setIcon(category.getIcon());
            existing.setSortOrder(category.getSortOrder());
            existing.setParentCategoryId(category.getParentCategoryId());
            existing.setUpdatedAt(LocalDateTime.now());
            return categoryRepository.save(existing);
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    @Override
    public void deleteCategory(String id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    @Override
    public Category activateCategory(String id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setIsActive(true);
            category.setUpdatedAt(LocalDateTime.now());
            return categoryRepository.save(category);
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }

    @Override
    public Category deactivateCategory(String id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setIsActive(false);
            category.setUpdatedAt(LocalDateTime.now());
            return categoryRepository.save(category);
        } else {
            throw new RuntimeException("Category not found with id: " + id);
        }
    }
}
