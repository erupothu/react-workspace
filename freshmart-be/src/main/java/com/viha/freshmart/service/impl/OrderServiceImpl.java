package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.Cart;
import com.viha.freshmart.dao.entity.CartItem;
import com.viha.freshmart.dao.entity.Customer;
import com.viha.freshmart.dao.entity.Order;
import com.viha.freshmart.dao.entity.OrderItem;
import com.viha.freshmart.dao.repository.CustomerRepository;
import com.viha.freshmart.dao.repository.OrderRepository;
import com.viha.freshmart.service.core.CartService;
import com.viha.freshmart.service.core.OrderService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CartService cartService;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    @Override
    public Optional<Order> getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber);
    }

    @Override
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByOrderStatus(status);
    }

    @Override
    public List<Order> getOrdersByPaymentStatus(String paymentStatus) {
        return orderRepository.findByPaymentStatus(paymentStatus);
    }

    @Override
    public List<Order> getOrdersByCustomerAndStatus(String customerId, String status) {
        return orderRepository.findByCustomerIdAndOrderStatus(customerId, status);
    }

    @Override
    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate);
    }

    @Override
    public Long getOrderCountByStatus(String status) {
        return orderRepository.countByOrderStatus(status);
    }

    @Override
    public Long getOrderCountByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.countByOrderDateBetween(startDate, endDate);
    }

    @Override
    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber(generateOrderNumber());
        }
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order createOrderFromCart(String customerId, Order orderDetails) {
        Optional<Cart> cartOpt = cartService.getCartByCustomerId(customerId);
        if (!cartOpt.isPresent() || cartOpt.get().getCartItems() == null || cartOpt.get().getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty or not found");
        }

        Cart cart = cartOpt.get();
        Order order = new Order();
        
        // Set customer
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()) {
            order.setCustomer(customer.get());
        } else {
            throw new RuntimeException("Customer not found");
        }

        // Convert cart items to order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            orderItem.setTotalPrice(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        // Set amounts from cart
        order.setSubtotal(cart.getTotalAmount());
        order.setTotalAmount(cart.getTotalAmount());
        order.setTaxAmount(BigDecimal.ZERO);
        order.setShippingAmount(BigDecimal.ZERO);
        order.setDiscountAmount(BigDecimal.ZERO);

        // Copy order details
        if (orderDetails != null) {
            order.setPaymentMethod(orderDetails.getPaymentMethod());
            order.setShippingAddress(orderDetails.getShippingAddress());
            order.setBillingAddress(orderDetails.getBillingAddress());
            order.setDeliveryInstructions(orderDetails.getDeliveryInstructions());
        }

        order.setOrderNumber(generateOrderNumber());
        order.setOrderStatus("PENDING");
        order.setPaymentStatus("PENDING");
        
        Order savedOrder = orderRepository.save(order);
        
        // Clear the cart after creating order
        cartService.clearCart(customerId);
        
        return savedOrder;
    }

    @Override
    public Order updateOrder(String id, Order order) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (!existingOrderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order existingOrder = existingOrderOpt.get();
        existingOrder.setUpdatedAt(LocalDateTime.now());
        
        // Update allowed fields
        if (order.getPaymentMethod() != null) {
            existingOrder.setPaymentMethod(order.getPaymentMethod());
        }
        if (order.getShippingAddress() != null) {
            existingOrder.setShippingAddress(order.getShippingAddress());
        }
        if (order.getBillingAddress() != null) {
            existingOrder.setBillingAddress(order.getBillingAddress());
        }
        if (order.getDeliveryInstructions() != null) {
            existingOrder.setDeliveryInstructions(order.getDeliveryInstructions());
        }

        return orderRepository.save(existingOrder);
    }

    @Override
    public Order updateOrderStatus(String id, String status) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setOrderStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order updatePaymentStatus(String id, String paymentStatus) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setPaymentStatus(paymentStatus);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order confirmOrder(String id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setOrderStatus("CONFIRMED");
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order shipOrder(String id, String trackingNumber) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setOrderStatus("SHIPPED");
        order.setTrackingNumber(trackingNumber);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order deliverOrder(String id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setOrderStatus("DELIVERED");
        order.setActualDeliveryDate(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(String id, String reason) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (!orderOpt.isPresent()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setOrderStatus("CANCELLED");
        order.setCancelReason(reason);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }

    @Override
    public String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD" + timestamp;
    }
}
