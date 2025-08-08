package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    
    List<Customer> getAllCustomers();
    
    Optional<Customer> getCustomerById(String id);
    
    Optional<Customer> getCustomerByEmail(String email);
    
    Optional<Customer> getCustomerByPhone(String phone);
    
    Customer registerCustomer(Customer customer);
    
    Customer loginCustomer(String email, String password);
    
    Customer updateCustomer(String id, Customer customer);
    
    Customer activateCustomer(String id);
    
    Customer deactivateCustomer(String id);
    
    Customer verifyEmail(String id);
    
    Customer verifyPhone(String id);
    
    void changePassword(String id, String oldPassword, String newPassword);
    
    void deleteCustomer(String id);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
}
