package com.virtualbank.controller;

import com.virtualbank.dto.ApiResponse;
import com.virtualbank.dto.TransactionRequest;
import com.virtualbank.dto.TransferRequest;
import com.virtualbank.entity.Account;
import com.virtualbank.entity.Transaction;
import com.virtualbank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getUserAccounts(@PathVariable Long userId) {
        return ResponseEntity.ok(accountService.getUserAccounts(userId));
    }

    @PostMapping("/deposit")
    public ResponseEntity<Account> deposit(@RequestBody TransactionRequest request) {
        return ResponseEntity.ok(accountService.deposit(request));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Account> withdraw(@RequestBody TransactionRequest request) {
        return ResponseEntity.ok(accountService.withdraw(request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse> transfer(@RequestBody TransferRequest request) {
        accountService.transfer(request);
        return ResponseEntity.ok(new ApiResponse("Transfer successful"));
    }

    @GetMapping("/{accountId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long accountId) {
        return ResponseEntity.ok(accountService.getTransactionHistory(accountId));
    }
}
