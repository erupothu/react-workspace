package com.viha.freshmart.controller;

import com.viha.freshmart.dao.entity.Product;
import com.viha.freshmart.service.core.ProductExcelService;
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
@RequestMapping("/api/products/excel")
@CrossOrigin(origins = "*")
@Tag(name = "Products Excel", description = "Excel import/export operations for Products")
public class ProductExcelController {
    
    @Autowired
    private ProductExcelService productExcelService;
    
    /**
     * Upload Excel file to import products
     * POST /api/products/excel/upload
     */
    @Operation(
        summary = "Import products from Excel file",
        description = "Upload an Excel file to import products data. The file should follow the standard template.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Products imported successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or format")
        }
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProductsExcel(
            @Parameter(description = "Excel file containing products data", required = true)
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Validate file
            if (!productExcelService.validateProductExcelFile(file)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid Excel file format. Please use the correct template.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Import products
            List<Product> importedProducts = productExcelService.importProductsFromExcel(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Products imported successfully");
            response.put("count", importedProducts.size());
            response.put("data", importedProducts);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to import products: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Download all products as Excel file
     * GET /api/products/excel/download
     */
    @Operation(
        summary = "Export all products to Excel",
        description = "Download all active products as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Excel file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/download")
    public ResponseEntity<ByteArrayResource> downloadProductsExcel() {
        try {
            ByteArrayResource resource = productExcelService.exportAllProductsToExcel();
            
            String fileName = "products_" + 
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
     * Download sample Excel template for products
     * GET /api/products/excel/template
     */
    @Operation(
        summary = "Download products Excel template",
        description = "Download a sample Excel template for importing products",
        responses = {
            @ApiResponse(responseCode = "200", description = "Template file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/template")
    public ResponseEntity<ByteArrayResource> downloadProductTemplate() {
        try {
            ByteArrayResource resource = productExcelService.getProductSampleTemplate();
            
            String fileName = "products_template.xlsx";
            
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
     * POST /api/products/excel/validate
     */
    @Operation(
        summary = "Validate products Excel file",
        description = "Validate if the uploaded Excel file has the correct format for products import",
        responses = {
            @ApiResponse(responseCode = "200", description = "File validation completed"),
            @ApiResponse(responseCode = "400", description = "Invalid file")
        }
    )
    @PostMapping(value = "/validate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> validateProductsExcel(
            @Parameter(description = "Excel file to validate", required = true)
            @RequestParam("file") MultipartFile file) {
        
        try {
            boolean isValid = productExcelService.validateProductExcelFile(file);
            
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
