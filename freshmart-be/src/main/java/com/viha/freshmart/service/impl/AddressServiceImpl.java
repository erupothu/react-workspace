package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.Address;
import com.viha.freshmart.dao.repository.AddressRepository;
import com.viha.freshmart.service.core.AddressService;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Optional<Address> getAddressById(String id) {
        return addressRepository.findById(id);
    }

    @Override
    public List<Address> getAddressesByCustomerId(String customerId) {
        return addressRepository.findByCustomerId(customerId);
    }

    @Override
    public Optional<Address> getDefaultAddress(String customerId) {
        return addressRepository.findByCustomerIdAndIsDefaultTrue(customerId);
    }

    @Override
    public List<Address> getAddressesByType(String customerId, String type) {
        return addressRepository.findByCustomerIdAndType(customerId, type);
    }

    @Override
    public Address createAddress(Address address) {
        // If this is the first address for the customer, make it default
        List<Address> existingAddresses = addressRepository.findByCustomerId(address.getCustomerId());
        if (existingAddresses.isEmpty()) {
            address.setIsDefault(true);
        }
        
        // If setting as default, unset other default addresses
        if (address.getIsDefault()) {
            Optional<Address> currentDefault = addressRepository.findByCustomerIdAndIsDefaultTrue(address.getCustomerId());
            if (currentDefault.isPresent()) {
                Address defaultAddr = currentDefault.get();
                defaultAddr.setIsDefault(false);
                addressRepository.save(defaultAddr);
            }
        }
        
        return addressRepository.save(address);
    }

    @Override
    public Address updateAddress(String id, Address address) {
        Optional<Address> existingAddress = addressRepository.findById(id);
        if (existingAddress.isPresent()) {
            Address existing = existingAddress.get();
            existing.setType(address.getType());
            existing.setFirstName(address.getFirstName());
            existing.setLastName(address.getLastName());
            existing.setPhone(address.getPhone());
            existing.setAddressLine1(address.getAddressLine1());
            existing.setAddressLine2(address.getAddressLine2());
            existing.setCity(address.getCity());
            existing.setState(address.getState());
            existing.setZipCode(address.getZipCode());
            existing.setCountry(address.getCountry());
            existing.setLandmark(address.getLandmark());
            existing.setLatitude(address.getLatitude());
            existing.setLongitude(address.getLongitude());
            
            // Handle default setting
            if (address.getIsDefault() && !existing.getIsDefault()) {
                // Unset other default addresses for this customer
                Optional<Address> currentDefault = addressRepository.findByCustomerIdAndIsDefaultTrue(existing.getCustomerId());
                if (currentDefault.isPresent()) {
                    Address defaultAddr = currentDefault.get();
                    defaultAddr.setIsDefault(false);
                    addressRepository.save(defaultAddr);
                }
                existing.setIsDefault(true);
            }
            
            return addressRepository.save(existing);
        } else {
            throw new RuntimeException("Address not found with id: " + id);
        }
    }

    @Override
    public Address setDefaultAddress(String id) {
        Optional<Address> addressOpt = addressRepository.findById(id);
        if (addressOpt.isPresent()) {
            Address address = addressOpt.get();
            
            // Unset current default address
            Optional<Address> currentDefault = addressRepository.findByCustomerIdAndIsDefaultTrue(address.getCustomerId());
            if (currentDefault.isPresent()) {
                Address defaultAddr = currentDefault.get();
                defaultAddr.setIsDefault(false);
                addressRepository.save(defaultAddr);
            }
            
            // Set new default
            address.setIsDefault(true);
            return addressRepository.save(address);
        } else {
            throw new RuntimeException("Address not found with id: " + id);
        }
    }

    @Override
    public void deleteAddress(String id) {
        if (addressRepository.existsById(id)) {
            addressRepository.deleteById(id);
        } else {
            throw new RuntimeException("Address not found with id: " + id);
        }
    }
}
