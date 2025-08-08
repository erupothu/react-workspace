package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Cart;
import com.viha.freshmart.dao.entity.CartItem;

import java.util.Optional;

public interface CartService {
    
    Optional<Cart> getCartByCustomerId(String customerId);
    
    Cart addItemToCart(String customerId, CartItem cartItem);
    
    Cart updateCartItem(String customerId, String productId, Integer quantity);
    
    Cart removeItemFromCart(String customerId, String productId);
    
    void clearCart(String customerId);
    
    Cart mergeCart(String customerId, Cart guestCart);
    
    Cart calculateCartTotals(Cart cart);
}
