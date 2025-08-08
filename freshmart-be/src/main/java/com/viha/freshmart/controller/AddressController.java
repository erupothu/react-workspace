package com.viha.freshmart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.viha.freshmart.dao.entity.Address;
import com.viha.freshmart.service.core.AddressService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable String id) {
        Optional<Address> address = addressService.getAddressById(id);
        return address.map(a -> new ResponseEntity<>(a, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Address>> getCustomerAddresses(@PathVariable String customerId) {
        List<Address> addresses = addressService.getAddressesByCustomerId(customerId);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    @GetMapping("/customer/{customerId}/default")
    public ResponseEntity<Address> getDefaultAddress(@PathVariable String customerId) {
        Optional<Address> address = addressService.getDefaultAddress(customerId);
        return address.map(a -> new ResponseEntity<>(a, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/customer/{customerId}/type/{type}")
    public ResponseEntity<List<Address>> getAddressesByType(@PathVariable String customerId, 
                                                           @PathVariable String type) {
        List<Address> addresses = addressService.getAddressesByType(customerId, type);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Address> createAddress(@RequestBody Address address) {
        Address createdAddress = addressService.createAddress(address);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable String id, @RequestBody Address address) {
        try {
            Address updatedAddress = addressService.updateAddress(id, address);
            return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}/set-default")
    public ResponseEntity<Address> setDefaultAddress(@PathVariable String id) {
        try {
            Address address = addressService.setDefaultAddress(id);
            return new ResponseEntity<>(address, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable String id) {
        try {
            addressService.deleteAddress(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
