package com.viha.freshmart.dao.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.viha.freshmart.dao.entity.AdminUsers;

@Repository
public interface AdminUserRepository extends MongoRepository<AdminUsers, String>{
    
}
