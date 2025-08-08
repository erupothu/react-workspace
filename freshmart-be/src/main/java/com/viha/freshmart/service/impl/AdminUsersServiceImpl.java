package com.viha.freshmart.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viha.freshmart.dao.entity.AdminUsers;
import com.viha.freshmart.dao.repository.AdminUserRepository;
import com.viha.freshmart.service.core.AdminUsersService;

@Service
public class AdminUsersServiceImpl implements AdminUsersService {

    @Autowired
    AdminUserRepository adminUserRepository;

    @Override
    public void createAdminUsers(AdminUsers user) {

        adminUserRepository.save(user);
        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'createAdminUsers'");
    }
    
}
