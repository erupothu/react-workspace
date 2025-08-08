package com.viha.freshmart.service.impl;

import com.viha.freshmart.dao.entity.Category;
import com.viha.freshmart.dao.repository.CategoryRepository;
import com.viha.freshmart.service.core.CategoryExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class CategoryExcelServiceImpl implements CategoryExcelService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    private static final String[] CATEGORY_HEADERS = {
        "Name", "Description", "Slug", "Image", "Icon", "Parent Category", 
        "Sort Order", "Meta Title", "Meta Description", "Is Active", "UID"
    };
    
    @Override
    public List<Category> importCategoriesFromExcel(MultipartFile file) {
        List<Category> categories = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            // Skip header row
            if (rows.hasNext()) {
                rows.next();
            }
            
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                Category category = createCategoryFromRow(currentRow);
                if (category != null) {
                    categories.add(category);
                }
            }
            
            // Save all categories
            return categoryRepository.saveAll(categories);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ByteArrayResource exportCategoriesToExcel(List<Category> categories) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Categories");
            
            // Create header row
            createHeaderRow(sheet);
            
            // Create data rows
            int rowNum = 1;
            for (Category category : categories) {
                createCategoryRow(sheet, category, rowNum++);
            }
            
            // Auto-size columns
            for (int i = 0; i < CATEGORY_HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to create Excel file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ByteArrayResource exportAllCategoriesToExcel() {
        List<Category> categories = categoryRepository.findByIsActiveTrueOrderBySortOrderAsc();
        return exportCategoriesToExcel(categories);
    }
    
    @Override
    public boolean validateCategoryExcelFile(MultipartFile file) {
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
            for (int i = 0; i < CATEGORY_HEADERS.length; i++) {
                Cell cell = headerRow.getCell(i);
                if (cell == null || !CATEGORY_HEADERS[i].equals(getCellStringValue(cell))) {
                    return false;
                }
            }
            
            return true;
            
        } catch (IOException e) {
            return false;
        }
    }
    
    @Override
    public ByteArrayResource getCategorySampleTemplate() {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Categories Template");
            
            // Create header row
            createHeaderRow(sheet);
            
            // Create sample data row
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("Electronics");
            sampleRow.createCell(1).setCellValue("Electronic items and gadgets");
            sampleRow.createCell(2).setCellValue("electronics");
            sampleRow.createCell(3).setCellValue("electronics.jpg");
            sampleRow.createCell(4).setCellValue("electronics-icon.svg");
            sampleRow.createCell(5).setCellValue(""); // Parent Category
            sampleRow.createCell(6).setCellValue(1); // Sort Order
            sampleRow.createCell(7).setCellValue("Electronics Category");
            sampleRow.createCell(8).setCellValue("Browse our electronics collection");
            sampleRow.createCell(9).setCellValue("TRUE");
            
            // Auto-size columns
            for (int i = 0; i < CATEGORY_HEADERS.length; i++) {
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
        
        for (int i = 0; i < CATEGORY_HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(CATEGORY_HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    private void createCategoryRow(Sheet sheet, Category category, int rowNum) {
        Row row = sheet.createRow(rowNum);
        
        row.createCell(0).setCellValue(category.getName());
        row.createCell(1).setCellValue(category.getDescription() != null ? category.getDescription() : "");
        row.createCell(2).setCellValue(category.getSlug() != null ? category.getSlug() : "");
        row.createCell(3).setCellValue(category.getImage() != null ? category.getImage() : "");
        row.createCell(4).setCellValue(category.getIcon() != null ? category.getIcon() : "");
        row.createCell(5).setCellValue(category.getParentCategoryId() != null ? category.getParentCategoryId() : "");
        row.createCell(6).setCellValue(category.getSortOrder() != null ? category.getSortOrder() : 0);
        row.createCell(7).setCellValue(category.getMetaTitle() != null ? category.getMetaTitle() : "");
        row.createCell(8).setCellValue(category.getMetaDescription() != null ? category.getMetaDescription() : "");
        row.createCell(9).setCellValue(category.getIsActive() ? "TRUE" : "FALSE");
        row.createCell(10).setCellValue(category.getId());
    }
    
    private Category createCategoryFromRow(Row row) {
        try {
            String name = getCellStringValue(row.getCell(0));
            if (name == null || name.trim().isEmpty()) {
                return null; // Skip rows without name
            }
            
            Category category = new Category();
            category.setName(name.trim());
            category.setDescription(getCellStringValue(row.getCell(1)));
            category.setSlug(getCellStringValue(row.getCell(2)));
            category.setImage(getCellStringValue(row.getCell(3)));
            category.setIcon(getCellStringValue(row.getCell(4)));
            category.setParentCategoryId(getCellStringValue(row.getCell(5)));
            
            // Sort Order
            Cell sortOrderCell = row.getCell(6);
            if (sortOrderCell != null) {
                category.setSortOrder((int) sortOrderCell.getNumericCellValue());
            }
            
            category.setMetaTitle(getCellStringValue(row.getCell(7)));
            category.setMetaDescription(getCellStringValue(row.getCell(8)));
            
            // Is Active
            String isActiveStr = getCellStringValue(row.getCell(9));
            category.setIsActive(isActiveStr != null && 
                              (isActiveStr.equalsIgnoreCase("TRUE") || isActiveStr.equalsIgnoreCase("1")));
            
            category.setCreatedAt(LocalDateTime.now());
            category.setUpdatedAt(LocalDateTime.now());
            category.setId(getCellStringValue(row.getCell(10)));
            
            return category;
            
        } catch (Exception e) {
            // Log error and skip this row
            System.err.println("Error processing row: " + e.getMessage());
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
