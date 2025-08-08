package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Product;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductExcelService {
    
    /**
     * Import products from Excel file
     */
    List<Product> importProductsFromExcel(MultipartFile file);
    
    /**
     * Export products to Excel file
     */
    ByteArrayResource exportProductsToExcel(List<Product> products);
    
    /**
     * Export all active products to Excel file
     */
    ByteArrayResource exportAllProductsToExcel();
    
    /**
     * Validate Excel file format for products
     */
    boolean validateProductExcelFile(MultipartFile file);
    
    /**
     * Get sample Excel template for products
     */
    ByteArrayResource getProductSampleTemplate();
}
