package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.Customer;

import java.util.Optional;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByPhone(String phone);
    
    Optional<Customer> findByEmailAndIsActiveTrue(String email);
    
    Optional<Customer> findByPhoneAndIsActiveTrue(String phone);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
}
