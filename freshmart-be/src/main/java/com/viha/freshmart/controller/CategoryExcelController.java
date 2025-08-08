package com.viha.freshmart.controller;

import com.viha.freshmart.dao.entity.Category;
import com.viha.freshmart.service.core.CategoryExcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories/excel")
@CrossOrigin(origins = "*")
@Tag(name = "Categories Excel", description = "Excel import/export operations for Categories")
public class CategoryExcelController {
    
    @Autowired
    private CategoryExcelService categoryExcelService;
    
    /**
     * Upload Excel file to import categories
     * POST /api/categories/excel/upload
     */
    @Operation(
        summary = "Import categories from Excel file",
        description = "Upload an Excel file to import categories data. The file should follow the standard template.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Categories imported successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or format")
        }
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadCategoriesExcel(
            @Parameter(description = "Excel file containing categories data", required = true)
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Validate file
            if (!categoryExcelService.validateCategoryExcelFile(file)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid Excel file format. Please use the correct template.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Import categories
            List<Category> importedCategories = categoryExcelService.importCategoriesFromExcel(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Categories imported successfully");
            response.put("count", importedCategories.size());
            response.put("data", importedCategories);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to import categories: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Download all categories as Excel file
     * GET /api/categories/excel/download
     */
    @Operation(
        summary = "Export all categories to Excel",
        description = "Download all active categories as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Excel file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/download")
    public ResponseEntity<ByteArrayResource> downloadCategoriesExcel() {
        try {
            ByteArrayResource resource = categoryExcelService.exportAllCategoriesToExcel();
            
            String fileName = "categories_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(resource.contentLength())
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Download sample Excel template for categories
     * GET /api/categories/excel/template
     */
    @Operation(
        summary = "Download categories Excel template",
        description = "Download a sample Excel template for importing categories",
        responses = {
            @ApiResponse(responseCode = "200", description = "Template file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/template")
    public ResponseEntity<ByteArrayResource> downloadCategoryTemplate() {
        try {
            ByteArrayResource resource = categoryExcelService.getCategorySampleTemplate();
            
            String fileName = "categories_template.xlsx";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .contentLength(resource.contentLength())
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Validate Excel file format
     * POST /api/categories/excel/validate
     */
    @Operation(
        summary = "Validate categories Excel file",
        description = "Validate if the uploaded Excel file has the correct format for categories import",
        responses = {
            @ApiResponse(responseCode = "200", description = "File validation completed"),
            @ApiResponse(responseCode = "400", description = "Invalid file")
        }
    )
    @PostMapping(value = "/validate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> validateCategoriesExcel(
            @Parameter(description = "Excel file to validate", required = true)
            @RequestParam("file") MultipartFile file) {
        
        try {
            boolean isValid = categoryExcelService.validateCategoryExcelFile(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("valid", isValid);
            response.put("message", isValid ? "File format is valid" : "Invalid file format");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("valid", false);
            errorResponse.put("message", "Error validating file: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
