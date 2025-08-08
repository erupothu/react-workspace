package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.Cart;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    
    Optional<Cart> findByCustomerId(String customerId);
    
    void deleteByCustomerId(String customerId);
}
