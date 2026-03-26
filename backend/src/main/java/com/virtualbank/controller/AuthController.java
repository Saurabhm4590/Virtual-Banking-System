package com.virtualbank.controller;

import com.virtualbank.dto.LoginRequest;
import com.virtualbank.dto.RegisterRequest;
import com.virtualbank.entity.User;
import com.virtualbank.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        User user = userService.loginUser(request);
        return ResponseEntity.ok(user);
    }
}
