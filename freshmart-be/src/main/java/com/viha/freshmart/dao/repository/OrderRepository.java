package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    
    List<Order> findByCustomerIdOrderByOrderDateDesc(String customerId);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByOrderStatus(String orderStatus);
    
    List<Order> findByPaymentStatus(String paymentStatus);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByCustomerIdAndOrderStatus(String customerId, String orderStatus);
    
    Long countByOrderStatus(String orderStatus);
    
    Long countByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
