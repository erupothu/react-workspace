package com.viha.freshmart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.viha.freshmart.dao.entity.Cart;
import com.viha.freshmart.dao.entity.CartItem;
import com.viha.freshmart.service.core.CartService;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Cart> getCustomerCart(@PathVariable String customerId) {
        Optional<Cart> cart = cartService.getCartByCustomerId(customerId);
        return cart.map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/customer/{customerId}/items")
    public ResponseEntity<Cart> addItemToCart(@PathVariable String customerId, @RequestBody CartItem cartItem) {
        try {
            Cart cart = cartService.addItemToCart(customerId, cartItem);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/customer/{customerId}/items/{productId}")
    public ResponseEntity<Cart> updateCartItem(@PathVariable String customerId, 
                                              @PathVariable String productId, 
                                              @RequestParam Integer quantity) {
        try {
            Cart cart = cartService.updateCartItem(customerId, productId, quantity);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/customer/{customerId}/items/{productId}")
    public ResponseEntity<Cart> removeItemFromCart(@PathVariable String customerId, 
                                                   @PathVariable String productId) {
        try {
            Cart cart = cartService.removeItemFromCart(customerId, productId);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/customer/{customerId}")
    public ResponseEntity<Void> clearCart(@PathVariable String customerId) {
        try {
            cartService.clearCart(customerId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/customer/{customerId}/merge")
    public ResponseEntity<Cart> mergeCart(@PathVariable String customerId, @RequestBody Cart guestCart) {
        try {
            Cart cart = cartService.mergeCart(customerId, guestCart);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
