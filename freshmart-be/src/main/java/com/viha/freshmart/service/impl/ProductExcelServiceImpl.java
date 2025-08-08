package com.viha.freshmart.service.impl;

import com.viha.freshmart.dao.entity.Product;
import com.viha.freshmart.dao.repository.ProductRepository;
import com.viha.freshmart.service.core.ProductExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Service
public class ProductExcelServiceImpl implements ProductExcelService {
    
    @Autowired
    private ProductRepository productRepository;
    
    private static final String[] PRODUCT_HEADERS = {
        "Name", "Description", "Price", "Discount Price", "Stock Quantity", 
        "Unit","Status","Min Stock", "Max Stock", "Brand", "Main Image", "Images","SKU","barcode", "Is Organic", 
        "Is Featured", "Nutrition Info", "Storage Instructions",  "Supplier", "Tags", "Rating", "UID", "Category ID", "Sub CategoryId"
    };
    
    @Override
    public List<Product> importProductsFromExcel(MultipartFile file) {
        List<Product> products = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            // Skip header row
            if (rows.hasNext()) {
                rows.next();
            }
            
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                Product product = createProductFromRow(currentRow);
                if (product != null) {
                    products.add(product);
                }
            }
            
            // Save all products
            return productRepository.saveAll(products);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ByteArrayResource exportProductsToExcel(List<Product> products) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Products");
            
            // Create header row
            createHeaderRow(sheet);
            
            // Create data rows
            int rowNum = 1;
            for (Product product : products) {
                createProductRow(sheet, product, rowNum++);
            }
            
            // Auto-size columns
            for (int i = 0; i < PRODUCT_HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to create Excel file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ByteArrayResource exportAllProductsToExcel() {
        List<Product> products = productRepository.findByIsActiveTrue();
        return exportProductsToExcel(products);
    }
    
    @Override
    public boolean validateProductExcelFile(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }
        
        String fileName = file.getOriginalFilename();
        if (fileName == null || (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls"))) {
            return false;
        }
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            
            if (headerRow == null) {
                return false;
            }
            
            // Validate header columns
            for (int i = 0; i < PRODUCT_HEADERS.length; i++) {
                Cell cell = headerRow.getCell(i);
                if (cell == null || !PRODUCT_HEADERS[i].equals(getCellStringValue(cell))) {
                    return false;
                }
            }
            
            return true;
            
        } catch (IOException e) {
            return false;
        }
    }
    
    @Override
    public ByteArrayResource getProductSampleTemplate() {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Products Template");
            
            // Create header row
            createHeaderRow(sheet);
            
            // Create sample data row
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("Fresh Red Apples");
            sampleRow.createCell(1).setCellValue("Fresh, crisp red apples from local farms");
            sampleRow.createCell(2).setCellValue("APPLE001");
            sampleRow.createCell(3).setCellValue(150.00);
            sampleRow.createCell(4).setCellValue(120.00);
            sampleRow.createCell(5).setCellValue(100);
            sampleRow.createCell(6).setCellValue("kg");
            sampleRow.createCell(7).setCellValue("FreshFarm");
            sampleRow.createCell(8).setCellValue("category123");
            sampleRow.createCell(9).setCellValue("apple-main.jpg");
            sampleRow.createCell(10).setCellValue("apple1.jpg,apple2.jpg");
            sampleRow.createCell(11).setCellValue("TRUE");
            sampleRow.createCell(12).setCellValue("FALSE");
            sampleRow.createCell(13).setCellValue("Rich in vitamins and fiber");
            sampleRow.createCell(14).setCellValue("Store in cool, dry place");
            sampleRow.createCell(15).setCellValue("TRUE");
            
            // Auto-size columns
            for (int i = 0; i < PRODUCT_HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to create template file: " + e.getMessage(), e);
        }
    }
    
    // Helper methods
    
    private void createHeaderRow(Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
        Font headerFont = sheet.getWorkbook().createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        
        for (int i = 0; i < PRODUCT_HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(PRODUCT_HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    private void createProductRow(Sheet sheet, Product product, int rowNum) {
        Row row = sheet.createRow(rowNum);
        row.createCell(0).setCellValue(product.getName());
        row.createCell(1).setCellValue(product.getDescription() != null ? product.getDescription() : "");
        row.createCell(2).setCellValue(product.getPrice() != null ? product.getPrice().doubleValue() : 0.0);
        row.createCell(3).setCellValue(product.getDiscountPrice() != null ? product.getDiscountPrice().doubleValue() : 0.0);
        row.createCell(4).setCellValue(product.getStockQuantity() != null ? product.getStockQuantity() : 0);
        row.createCell(5).setCellValue(product.getUnit() != null ? product.getUnit() : "");
        row.createCell(6).setCellValue(product.getStatus());
        row.createCell(7).setCellValue(product.getMinStock());
        row.createCell(8).setCellValue(product.getMaxStock());
        row.createCell(9).setCellValue(product.getBrand() != null ? product.getBrand() : "");
        row.createCell(10).setCellValue(product.getMainImage() != null ? product.getMainImage() : "");
        row.createCell(11).setCellValue(product.getImages() != null ? String.join(",", product.getImages()) : "");
        row.createCell(12).setCellValue(product.getSku() != null ? product.getSku() : "");
        row.createCell(13).setCellValue(product.getBarcode());
        row.createCell(14).setCellValue(product.getIsOrganic() ? "TRUE" : "FALSE");
        row.createCell(15).setCellValue(product.getIsFeatured() ? "TRUE" : "FALSE");
        row.createCell(16).setCellValue(product.getNutritionInfo() != null ? product.getNutritionInfo() : "");
        row.createCell(17).setCellValue(product.getStorageInstructions() != null ? product.getStorageInstructions() : "");
        row.createCell(18).setCellValue(product.getSupplier());
        row.createCell(19).setCellValue(product.getTags() != null ? String.join(",", product.getTags()) : "");
        row.createCell(20).setCellValue(product.getRating());
        row.createCell(21).setCellValue(product.getId());
        row.createCell(22).setCellValue(product.getCategoryId() != null ? product.getCategoryId() : "");
        row.createCell(23).setCellValue(product.getSubCategoryId() != null ? product.getSubCategoryId() : "1");
        
    }
    
    private Product createProductFromRow(Row row) {
        try {
            String name = getCellStringValue(row.getCell(0));
            // if (name == null || name.trim().isEmpty()) {
            //     return null; // Skip rows without name
            // }
            Product product = new Product();
            
            product.setName(getCellStringValue(row.getCell(0)));
            product.setDescription(getCellStringValue(row.getCell(1)));
            // Price
            Cell priceCell = row.getCell(2);
            if (priceCell != null) {
                product.setPrice(BigDecimal.valueOf(priceCell.getNumericCellValue()));
            }
            
            // Discount Price
            Cell discountPriceCell = row.getCell(3);
            if (discountPriceCell != null && discountPriceCell.getNumericCellValue() > 0) {
                product.setDiscountPrice(BigDecimal.valueOf(discountPriceCell.getNumericCellValue()));
            }
            
            // Stock Quantity
            Cell stockCell = row.getCell(4);
            if (stockCell != null) {
                product.setStockQuantity((int) stockCell.getNumericCellValue());
            }
            
            product.setUnit(getCellStringValue(row.getCell(5)));
            product.setStatus(getCellStringValue(row.getCell(6)));
            product.setMinStock(getCellStringValue(row.getCell(7)));
            product.setMaxStock(getCellStringValue(row.getCell(8)));
            product.setBrand(getCellStringValue(row.getCell(9)));
            product.setMainImage(getCellStringValue(row.getCell(10)));
            // Images (comma-separated)
            String imagesStr = getCellStringValue(row.getCell(11));
            if (imagesStr != null && !imagesStr.trim().isEmpty()) {
                product.setImages(Arrays.asList(imagesStr.split(",")));
            }
            product.setSku(getCellStringValue(row.getCell(12)));
            product.setBarcode(getCellStringValue(row.getCell(13)));
            // Boolean fields
            String isOrganicStr = getCellStringValue(row.getCell(14));
            product.setIsOrganic(isOrganicStr != null && 
                              (isOrganicStr.equalsIgnoreCase("TRUE") || isOrganicStr.equalsIgnoreCase("1")));
            
            String isFeaturedStr = getCellStringValue(row.getCell(15));
            product.setIsFeatured(isFeaturedStr != null && 
                               (isFeaturedStr.equalsIgnoreCase("TRUE") || isFeaturedStr.equalsIgnoreCase("1")));
            
            product.setNutritionInfo(getCellStringValue(row.getCell(16)));
            product.setStorageInstructions(getCellStringValue(row.getCell(17)));
            product.setSupplier(getCellStringValue(row.getCell(18)));
            
            String tagsStr = getCellStringValue(row.getCell(19));
            if (tagsStr != null && !tagsStr.trim().isEmpty()) {
                product.setTags(Arrays.asList(tagsStr.split(",")));
            }
            Cell ratinngCell = row.getCell(20);
            if (ratinngCell != null) {
                product.setRating(Double.valueOf(ratinngCell.getNumericCellValue()));
            }
            if(getCellStringValue(row.getCell(21))!="") {
                product.setId(getCellStringValue(row.getCell(21)));
            }
            
            product.setCategoryId(getCellStringValue(row.getCell(22)));
            product.setSubCategoryId(getCellStringValue(row.getCell(23)));
            
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            
            return product;
            
        } catch (Exception e) {
            // Log error and skip this row
            System.err.println("Error processing product row: " + e.getMessage());
            return null;
        }
    }
    
    private String getCellStringValue(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
}
