package com.viha.freshmart.controller;

import com.viha.freshmart.service.core.OrderExcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/orders/excel")
@CrossOrigin(origins = "*")
@Tag(name = "Orders Excel", description = "Excel export operations for Orders")
public class OrderExcelController {
    
    @Autowired
    private OrderExcelService orderExcelService;
    
    /**
     * Download all orders as Excel file
     * GET /api/orders/excel/download
     */
    @Operation(
        summary = "Export all orders to Excel",
        description = "Download all orders as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Excel file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/download")
    public ResponseEntity<ByteArrayResource> downloadOrdersExcel() {
        try {
            ByteArrayResource resource = orderExcelService.exportAllOrdersToExcel();
            
            String fileName = "orders_" + 
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
     * Download orders by date range as Excel file
     * GET /api/orders/excel/download/date-range
     */
    @Operation(
        summary = "Export orders by date range to Excel",
        description = "Download orders within a specific date range as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Excel file generated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid date range"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/download/date-range")
    public ResponseEntity<ByteArrayResource> downloadOrdersByDateRangeExcel(
            @Parameter(description = "Start date (YYYY-MM-DD)", required = true, example = "2025-01-01")
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            
            @Parameter(description = "End date (YYYY-MM-DD)", required = true, example = "2025-12-31")
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        try {
            if (startDate.isAfter(endDate)) {
                return ResponseEntity.badRequest().build();
            }
            
            ByteArrayResource resource = orderExcelService.exportOrdersByDateRangeToExcel(startDate, endDate);
            
            String fileName = "orders_" + startDate + "_to_" + endDate + "_" + 
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
     * Download orders by status as Excel file
     * GET /api/orders/excel/download/status/{status}
     */
    @Operation(
        summary = "Export orders by status to Excel",
        description = "Download orders with a specific status as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Excel file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/download/status/{status}")
    public ResponseEntity<ByteArrayResource> downloadOrdersByStatusExcel(
            @Parameter(description = "Order status", required = true, example = "PENDING")
            @PathVariable String status) {
        
        try {
            ByteArrayResource resource = orderExcelService.exportOrdersByStatusToExcel(status);
            
            String fileName = "orders_" + status.toLowerCase() + "_" + 
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
     * Download orders by customer as Excel file
     * GET /api/orders/excel/download/customer/{customerId}
     */
    @Operation(
        summary = "Export orders by customer to Excel",
        description = "Download orders for a specific customer as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Excel file generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/download/customer/{customerId}")
    public ResponseEntity<ByteArrayResource> downloadOrdersByCustomerExcel(
            @Parameter(description = "Customer ID", required = true, example = "customer123")
            @PathVariable String customerId) {
        
        try {
            ByteArrayResource resource = orderExcelService.exportOrdersByCustomerToExcel(customerId);
            
            String fileName = "orders_customer_" + customerId + "_" + 
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
     * Download orders summary report as Excel file
     * GET /api/orders/excel/report/summary
     */
    @Operation(
        summary = "Generate orders summary report",
        description = "Download a comprehensive orders summary report with statistics as an Excel file",
        responses = {
            @ApiResponse(responseCode = "200", description = "Summary report generated successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
        }
    )
    @GetMapping("/report/summary")
    public ResponseEntity<ByteArrayResource> downloadOrdersSummaryReport() {
        try {
            ByteArrayResource resource = orderExcelService.generateOrdersSummaryReport();
            
            String fileName = "orders_summary_report_" + 
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
}
