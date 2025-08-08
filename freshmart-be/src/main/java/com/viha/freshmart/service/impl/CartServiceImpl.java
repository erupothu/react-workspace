package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.Cart;
import com.viha.freshmart.dao.entity.CartItem;
import com.viha.freshmart.dao.entity.Customer;
import com.viha.freshmart.dao.repository.CartRepository;
import com.viha.freshmart.dao.repository.CustomerRepository;
import com.viha.freshmart.service.core.CartService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Optional<Cart> getCartByCustomerId(String customerId) {
        return cartRepository.findByCustomerId(customerId);
    }

    @Override
    public Cart addItemToCart(String customerId, CartItem cartItem) {
        Optional<Cart> existingCart = cartRepository.findByCustomerId(customerId);
        Cart cart;
        
        if (existingCart.isPresent()) {
            cart = existingCart.get();
        } else {
            cart = new Cart();
            Optional<Customer> customer = customerRepository.findById(customerId);
            if (customer.isPresent()) {
                cart.setCustomer(customer.get());
            } else {
                throw new RuntimeException("Customer not found");
            }
            cart.setCartItems(new ArrayList<>());
        }

        // Check if item already exists in cart
        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems == null) {
            cartItems = new ArrayList<>();
            cart.setCartItems(cartItems);
        }

        boolean itemExists = false;
        for (CartItem existingItem : cartItems) {
            if (existingItem.getProduct().getId().equals(cartItem.getProduct().getId())) {
                existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
                itemExists = true;
                break;
            }
        }

        if (!itemExists) {
            cartItems.add(cartItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cart = calculateCartTotals(cart);
        return cartRepository.save(cart);
    }

    @Override
    public Cart updateCartItem(String customerId, String productId, Integer quantity) {
        Optional<Cart> cartOpt = cartRepository.findByCustomerId(customerId);
        if (!cartOpt.isPresent()) {
            throw new RuntimeException("Cart not found");
        }

        Cart cart = cartOpt.get();
        List<CartItem> cartItems = cart.getCartItems();
        
        if (cartItems != null) {
            for (CartItem item : cartItems) {
                if (item.getProduct().getId().equals(productId)) {
                    if (quantity <= 0) {
                        cartItems.remove(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                    break;
                }
            }
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cart = calculateCartTotals(cart);
        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItemFromCart(String customerId, String productId) {
        Optional<Cart> cartOpt = cartRepository.findByCustomerId(customerId);
        if (!cartOpt.isPresent()) {
            throw new RuntimeException("Cart not found");
        }

        Cart cart = cartOpt.get();
        List<CartItem> cartItems = cart.getCartItems();
        
        if (cartItems != null) {
            cartItems.removeIf(item -> item.getProduct().getId().equals(productId));
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cart = calculateCartTotals(cart);
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(String customerId) {
        cartRepository.deleteByCustomerId(customerId);
    }

    @Override
    public Cart mergeCart(String customerId, Cart guestCart) {
        Optional<Cart> existingCartOpt = cartRepository.findByCustomerId(customerId);
        
        if (!existingCartOpt.isPresent()) {
            // If no existing cart, create new one for customer
            Optional<Customer> customer = customerRepository.findById(customerId);
            if (customer.isPresent()) {
                guestCart.setCustomer(customer.get());
                guestCart.setUpdatedAt(LocalDateTime.now());
                return cartRepository.save(guestCart);
            } else {
                throw new RuntimeException("Customer not found");
            }
        }

        Cart existingCart = existingCartOpt.get();
        List<CartItem> existingItems = existingCart.getCartItems();
        List<CartItem> guestItems = guestCart.getCartItems();

        if (existingItems == null) {
            existingItems = new ArrayList<>();
            existingCart.setCartItems(existingItems);
        }

        if (guestItems != null) {
            for (CartItem guestItem : guestItems) {
                boolean itemExists = false;
                for (CartItem existingItem : existingItems) {
                    if (existingItem.getProduct().getId().equals(guestItem.getProduct().getId())) {
                        existingItem.setQuantity(existingItem.getQuantity() + guestItem.getQuantity());
                        itemExists = true;
                        break;
                    }
                }
                if (!itemExists) {
                    existingItems.add(guestItem);
                }
            }
        }

        existingCart.setUpdatedAt(LocalDateTime.now());
        existingCart = calculateCartTotals(existingCart);
        return cartRepository.save(existingCart);
    }

    @Override
    public Cart calculateCartTotals(Cart cart) {
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            cart.setTotalAmount(BigDecimal.ZERO);
            cart.setTotalItems(0);
            return cart;
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getCartItems()) {
            if (item.getProduct() != null && item.getProduct().getPrice() != null) {
                BigDecimal itemTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                totalAmount = totalAmount.add(itemTotal);
                totalItems += item.getQuantity();
            }
        }

        cart.setTotalAmount(totalAmount);
        cart.setTotalItems(totalItems);
        return cart;
    }
}
