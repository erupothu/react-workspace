package com.viha.freshmart.service.impl;

import com.viha.freshmart.dao.entity.Order;
import com.viha.freshmart.dao.entity.OrderItem;
import com.viha.freshmart.dao.repository.OrderRepository;
import com.viha.freshmart.service.core.OrderExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class OrderExcelServiceImpl implements OrderExcelService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    private static final String[] ORDER_HEADERS = {
        "Order Number", "Customer ID", "Customer Name", "Order Date", "Status", 
        "Payment Status", "Total Amount", "Shipping Address", "Billing Address", 
        "Payment Method", "Tracking Number", "Items", "Created At", "Updated At"
    };
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public ByteArrayResource exportOrdersToExcel(List<Order> orders) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("Orders");
            
            // Create header row
            createHeaderRow(sheet);
            
            // Create data rows
            int rowNum = 1;
            for (Order order : orders) {
                createOrderRow(sheet, order, rowNum++);
            }
            
            // Auto-size columns
            for (int i = 0; i < ORDER_HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to create Excel file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ByteArrayResource exportAllOrdersToExcel() {
        List<Order> orders = orderRepository.findAll();
        return exportOrdersToExcel(orders);
    }

    @Override
    public ByteArrayResource exportOrdersByDateRangeToExcel(LocalDate startDate, LocalDate endDate) {
        List<Order> orders = orderRepository.findByOrderDateBetween(
            startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        return exportOrdersToExcel(orders);
    }

    @Override
    public ByteArrayResource exportOrdersByStatusToExcel(String status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        return exportOrdersToExcel(orders);
    }

    @Override
    public ByteArrayResource exportOrdersByCustomerToExcel(String customerId) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
        return exportOrdersToExcel(orders);
    }
    
    @Override
    public ByteArrayResource generateOrdersSummaryReport() {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            
            // Create Orders sheet
            Sheet ordersSheet = workbook.createSheet("Orders");
            List<Order> orders = orderRepository.findAll();
            createOrdersReport(ordersSheet, orders);
            
            // Create Summary sheet
            Sheet summarySheet = workbook.createSheet("Summary");
            createSummaryReport(summarySheet, orders);
            
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to create summary report: " + e.getMessage(), e);
        }
    }
    
    // Helper methods
    
    private void createHeaderRow(Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = sheet.getWorkbook().createCellStyle();
        Font headerFont = sheet.getWorkbook().createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);
        
        for (int i = 0; i < ORDER_HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(ORDER_HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    private void createOrderRow(Sheet sheet, Order order, int rowNum) {
        Row row = sheet.createRow(rowNum);

        row.createCell(0).setCellValue(order.getOrderNumber() != null ? order.getOrderNumber() : "");
        row.createCell(1).setCellValue(order.getCustomer() != null ? order.getCustomer().getId() : "");
        row.createCell(2).setCellValue(order.getCustomer() != null ?
            (order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName()) : "");
        row.createCell(3).setCellValue(order.getOrderDate() != null ? order.getOrderDate().format(DATE_FORMATTER) : "");
        row.createCell(4).setCellValue(order.getOrderStatus() != null ? order.getOrderStatus() : "");
        row.createCell(5).setCellValue(order.getPaymentStatus() != null ? order.getPaymentStatus() : "");
        row.createCell(6).setCellValue(order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0.0);
        row.createCell(7).setCellValue(order.getShippingAddress() != null ?
            formatAddress(order.getShippingAddress()) : "");
        row.createCell(8).setCellValue(order.getBillingAddress() != null ?
            formatAddress(order.getBillingAddress()) : "");
        row.createCell(9).setCellValue(order.getPaymentMethod() != null ? order.getPaymentMethod() : "");
        row.createCell(10).setCellValue(order.getTrackingNumber() != null ? order.getTrackingNumber() : "");

        // Order Items summary
        StringBuilder itemsStr = new StringBuilder();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                if (itemsStr.length() > 0) itemsStr.append("; ");
                itemsStr.append(item.getProduct() != null ? item.getProduct().getName() : "Unknown")
                       .append(" (").append(item.getQuantity()).append(")");
            }
        }
        row.createCell(11).setCellValue(itemsStr.toString());

        row.createCell(12).setCellValue(order.getCreatedAt() != null ? order.getCreatedAt().format(DATE_FORMATTER) : "");
        row.createCell(13).setCellValue(order.getUpdatedAt() != null ? order.getUpdatedAt().format(DATE_FORMATTER) : "");
    }
    
    private void createOrdersReport(Sheet sheet, List<Order> orders) {
        createHeaderRow(sheet);
        
        int rowNum = 1;
        for (Order order : orders) {
            createOrderRow(sheet, order, rowNum++);
        }
        
        // Auto-size columns
        for (int i = 0; i < ORDER_HEADERS.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void createSummaryReport(Sheet sheet, List<Order> orders) {
        // Create title
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Orders Summary Report");
        
        CellStyle titleStyle = sheet.getWorkbook().createCellStyle();
        Font titleFont = sheet.getWorkbook().createFont();
        titleFont.setBold(true);
        titleFont.setFontHeight((short) 16);
        titleStyle.setFont(titleFont);
        titleCell.setCellStyle(titleStyle);
        
        // Summary statistics
        int rowNum = 2;
        
        // Total orders
        Row totalOrdersRow = sheet.createRow(rowNum++);
        totalOrdersRow.createCell(0).setCellValue("Total Orders:");
        totalOrdersRow.createCell(1).setCellValue(orders.size());
        
        // Count by status
        long pendingCount = orders.stream().filter(o -> "PENDING".equals(o.getOrderStatus())).count();
        long confirmedCount = orders.stream().filter(o -> "CONFIRMED".equals(o.getOrderStatus())).count();
        long shippedCount = orders.stream().filter(o -> "SHIPPED".equals(o.getOrderStatus())).count();
        long deliveredCount = orders.stream().filter(o -> "DELIVERED".equals(o.getOrderStatus())).count();
        long cancelledCount = orders.stream().filter(o -> "CANCELLED".equals(o.getOrderStatus())).count();
        
        Row pendingRow = sheet.createRow(rowNum++);
        pendingRow.createCell(0).setCellValue("Pending Orders:");
        pendingRow.createCell(1).setCellValue(pendingCount);
        
        Row confirmedRow = sheet.createRow(rowNum++);
        confirmedRow.createCell(0).setCellValue("Confirmed Orders:");
        confirmedRow.createCell(1).setCellValue(confirmedCount);
        
        Row shippedRow = sheet.createRow(rowNum++);
        shippedRow.createCell(0).setCellValue("Shipped Orders:");
        shippedRow.createCell(1).setCellValue(shippedCount);
        
        Row deliveredRow = sheet.createRow(rowNum++);
        deliveredRow.createCell(0).setCellValue("Delivered Orders:");
        deliveredRow.createCell(1).setCellValue(deliveredCount);
        
        Row cancelledRow = sheet.createRow(rowNum++);
        cancelledRow.createCell(0).setCellValue("Cancelled Orders:");
        cancelledRow.createCell(1).setCellValue(cancelledCount);
        
        // Total revenue
        double totalRevenue = orders.stream()
            .filter(o -> !"CANCELLED".equals(o.getOrderStatus()))
            .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
            .sum();
        
        Row revenueRow = sheet.createRow(rowNum++);
        revenueRow.createCell(0).setCellValue("Total Revenue:");
        revenueRow.createCell(1).setCellValue(totalRevenue);
        
        // Auto-size columns
        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private String formatAddress(com.viha.freshmart.dao.entity.Address address) {
        if (address == null) return "";

        StringBuilder sb = new StringBuilder();
        if (address.getAddressLine1() != null) sb.append(address.getAddressLine1());
        if (address.getAddressLine2() != null && !address.getAddressLine2().isEmpty()) {
            sb.append(", ").append(address.getAddressLine2());
        }
        if (address.getCity() != null) sb.append(", ").append(address.getCity());
        if (address.getState() != null) sb.append(", ").append(address.getState());
        if (address.getZipCode() != null) sb.append(" - ").append(address.getZipCode());

        return sb.toString();
    }
}
