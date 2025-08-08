package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Order;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface OrderExcelService {
    
    /**
     * Export orders to Excel file
     */
    ByteArrayResource exportOrdersToExcel(List<Order> orders);
    
    /**
     * Export all orders to Excel file
     */
    ByteArrayResource exportAllOrdersToExcel();
    
    /**
     * Export orders by date range to Excel file
     */
    ByteArrayResource exportOrdersByDateRangeToExcel(LocalDate startDate, LocalDate endDate);
    
    /**
     * Export orders by status to Excel file
     */
    ByteArrayResource exportOrdersByStatusToExcel(String status);
    
    /**
     * Export orders by customer to Excel file
     */
    ByteArrayResource exportOrdersByCustomerToExcel(String customerId);
    
    /**
     * Get orders summary report in Excel
     */
    ByteArrayResource generateOrdersSummaryReport();
}
