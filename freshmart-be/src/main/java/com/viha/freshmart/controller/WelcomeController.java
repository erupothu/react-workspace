package com.viha.freshmart.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class WelcomeController {
    

    @GetMapping("/")
    public ResponseEntity<?> getWelcomeMessage() {
        return new ResponseEntity("welcome to FreshMart", HttpStatus.OK);
    }
    
}
