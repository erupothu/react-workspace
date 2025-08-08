package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Category;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryExcelService {
    
    /**
     * Import categories from Excel file
     */
    List<Category> importCategoriesFromExcel(MultipartFile file);
    
    /**
     * Export categories to Excel file
     */
    ByteArrayResource exportCategoriesToExcel(List<Category> categories);
    
    /**
     * Export all active categories to Excel file
     */
    ByteArrayResource exportAllCategoriesToExcel();
    
    /**
     * Validate Excel file format for categories
     */
    boolean validateCategoryExcelFile(MultipartFile file);
    
    /**
     * Get sample Excel template for categories
     */
    ByteArrayResource getCategorySampleTemplate();
}
