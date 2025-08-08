package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    
    List<Order> getAllOrders();
    
    Optional<Order> getOrderById(String id);
    
    Optional<Order> getOrderByOrderNumber(String orderNumber);
    
    List<Order> getOrdersByCustomer(String customerId);
    
    List<Order> getOrdersByStatus(String status);
    
    List<Order> getOrdersByPaymentStatus(String paymentStatus);
    
    List<Order> getOrdersByCustomerAndStatus(String customerId, String status);
    
    List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    Long getOrderCountByStatus(String status);
    
    Long getOrderCountByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    Order createOrder(Order order);
    
    Order createOrderFromCart(String customerId, Order orderDetails);
    
    Order updateOrder(String id, Order order);
    
    Order updateOrderStatus(String id, String status);
    
    Order updatePaymentStatus(String id, String paymentStatus);
    
    Order confirmOrder(String id);
    
    Order shipOrder(String id, String trackingNumber);
    
    Order deliverOrder(String id);
    
    Order cancelOrder(String id, String reason);
    
    void deleteOrder(String id);
    
    String generateOrderNumber();
}
