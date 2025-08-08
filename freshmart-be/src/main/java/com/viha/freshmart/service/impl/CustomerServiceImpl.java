package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.Customer;
import com.viha.freshmart.dao.repository.CustomerRepository;
import com.viha.freshmart.service.core.CustomerService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    @Override
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmailAndIsActiveTrue(email);
    }

    @Override
    public Optional<Customer> getCustomerByPhone(String phone) {
        return customerRepository.findByPhoneAndIsActiveTrue(phone);
    }

    @Override
    public Customer registerCustomer(Customer customer) {
        // Check if email already exists
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Check if phone already exists
        if (customerRepository.existsByPhone(customer.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }
        
        // Encrypt password (in a real application, use BCrypt or similar)
        // customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        customer.setIsActive(true);
        customer.setIsEmailVerified(false);
        customer.setIsPhoneVerified(false);
        
        return customerRepository.save(customer);
    }

    @Override
    public Customer loginCustomer(String email, String password) {
        Optional<Customer> customerOpt = customerRepository.findByEmailAndIsActiveTrue(email);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            // In a real application, verify password with BCrypt
            if (customer.getPassword().equals(password)) {
                customer.setLastLoginAt(LocalDateTime.now());
                return customerRepository.save(customer);
            } else {
                throw new RuntimeException("Invalid password");
            }
        } else {
            throw new RuntimeException("Customer not found");
        }
    }

    @Override
    public Customer updateCustomer(String id, Customer customer) {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isPresent()) {
            Customer existing = existingCustomer.get();
            existing.setFirstName(customer.getFirstName());
            existing.setLastName(customer.getLastName());
            existing.setPhone(customer.getPhone());
            existing.setProfileImage(customer.getProfileImage());
            existing.setDateOfBirth(customer.getDateOfBirth());
            existing.setGender(customer.getGender());
            existing.setPreferredLanguage(customer.getPreferredLanguage());
            existing.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(existing);
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public Customer activateCustomer(String id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setIsActive(true);
            customer.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(customer);
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public Customer deactivateCustomer(String id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setIsActive(false);
            customer.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(customer);
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public Customer verifyEmail(String id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setIsEmailVerified(true);
            customer.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(customer);
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public Customer verifyPhone(String id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setIsPhoneVerified(true);
            customer.setUpdatedAt(LocalDateTime.now());
            return customerRepository.save(customer);
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public void changePassword(String id, String oldPassword, String newPassword) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            // In a real application, verify old password with BCrypt
            if (customer.getPassword().equals(oldPassword)) {
                customer.setPassword(newPassword); // Should be encrypted
                customer.setUpdatedAt(LocalDateTime.now());
                customerRepository.save(customer);
            } else {
                throw new RuntimeException("Invalid old password");
            }
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public void deleteCustomer(String id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
        } else {
            throw new RuntimeException("Customer not found with id: " + id);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return customerRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return customerRepository.existsByPhone(phone);
    }
}
