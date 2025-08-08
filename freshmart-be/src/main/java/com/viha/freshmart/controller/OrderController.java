package com.viha.freshmart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.viha.freshmart.dao.entity.Order;
import com.viha.freshmart.service.core.OrderService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(o -> new ResponseEntity<>(o, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        Optional<Order> order = orderService.getOrderByOrderNumber(orderNumber);
        return order.map(o -> new ResponseEntity<>(o, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable String customerId) {
        List<Order> orders = orderService.getOrdersByCustomer(customerId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/payment-status/{paymentStatus}")
    public ResponseEntity<List<Order>> getOrdersByPaymentStatus(@PathVariable String paymentStatus) {
        List<Order> orders = orderService.getOrdersByPaymentStatus(paymentStatus);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/customer/{customerId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByCustomerAndStatus(@PathVariable String customerId, 
                                                                   @PathVariable String status) {
        List<Order> orders = orderService.getOrdersByCustomerAndStatus(customerId, status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Order> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> getOrderCountByStatus(@PathVariable String status) {
        Long count = orderService.getOrderCountByStatus(status);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/stats/count-by-date-range")
    public ResponseEntity<Long> getOrderCountByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Long count = orderService.getOrderCountByDateRange(startDate, endDate);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        try {
            Order createdOrder = orderService.createOrder(order);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/customer/{customerId}/from-cart")
    public ResponseEntity<Order> createOrderFromCart(@PathVariable String customerId, 
                                                     @RequestBody Order orderDetails) {
        try {
            Order createdOrder = orderService.createOrderFromCart(customerId, orderDetails);
            return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody Order order) {
        try {
            Order updatedOrder = orderService.updateOrder(id, order);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(id, status);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<Order> updatePaymentStatus(@PathVariable String id, @RequestParam String paymentStatus) {
        try {
            Order order = orderService.updatePaymentStatus(id, paymentStatus);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Order> confirmOrder(@PathVariable String id) {
        try {
            Order order = orderService.confirmOrder(id);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/ship")
    public ResponseEntity<Order> shipOrder(@PathVariable String id, @RequestParam String trackingNumber) {
        try {
            Order order = orderService.shipOrder(id, trackingNumber);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<Order> deliverOrder(@PathVariable String id) {
        try {
            Order order = orderService.deliverOrder(id);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable String id, @RequestParam String reason) {
        try {
            Order order = orderService.cancelOrder(id, reason);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        try {
            orderService.deleteOrder(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
