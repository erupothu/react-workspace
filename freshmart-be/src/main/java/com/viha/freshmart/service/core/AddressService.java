package com.viha.freshmart.service.core;

import com.viha.freshmart.dao.entity.Address;

import java.util.List;
import java.util.Optional;

public interface AddressService {
    
    Optional<Address> getAddressById(String id);
    
    List<Address> getAddressesByCustomerId(String customerId);
    
    Optional<Address> getDefaultAddress(String customerId);
    
    List<Address> getAddressesByType(String customerId, String type);
    
    Address createAddress(Address address);
    
    Address updateAddress(String id, Address address);
    
    Address setDefaultAddress(String id);
    
    void deleteAddress(String id);
}
