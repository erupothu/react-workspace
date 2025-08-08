package com.viha.freshmart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.viha.freshmart.dao.entity.AdminUsers;
import com.viha.freshmart.service.core.AdminUsersService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class AdminUserController {
    
    @Autowired
    AdminUsersService adminUsersService;

    @PostMapping("create-admin-user")
    public ResponseEntity<?> createAdminUser(@RequestBody AdminUsers user) {
        //TODO: process POST request
        adminUsersService.createAdminUsers(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}
