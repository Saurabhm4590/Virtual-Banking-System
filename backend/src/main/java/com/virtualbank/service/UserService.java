package com.virtualbank.service;

import com.virtualbank.dto.LoginRequest;
import com.virtualbank.dto.RegisterRequest;
import com.virtualbank.entity.Account;
import com.virtualbank.entity.User;
import com.virtualbank.repository.AccountRepository;
import com.virtualbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    public User registerUser(RegisterRequest request) {
        if(userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // Storing raw password for simplicity
        user.setEmail(request.getEmail());
        
        user = userRepository.save(user);

        // Auto-create an initial account for the user
        Account account = new Account();
        account.setUser(user);
        // Generate a random 10-digit account number
        account.setAccountNumber(String.valueOf(Math.abs(UUID.randomUUID().getMostSignificantBits())).substring(0, 10));
        account.setBalance(BigDecimal.ZERO);
        accountRepository.save(account);

        return user;
    }

    public User loginUser(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if(userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())) {
            return userOpt.get();
        }
        throw new RuntimeException("Invalid credentials");
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
