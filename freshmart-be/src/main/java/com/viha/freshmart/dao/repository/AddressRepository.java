package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.Address;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends MongoRepository<Address, String> {
    
    List<Address> findByCustomerId(String customerId);
    
    Optional<Address> findByCustomerIdAndIsDefaultTrue(String customerId);
    
    List<Address> findByCustomerIdAndType(String customerId, String type);
}
