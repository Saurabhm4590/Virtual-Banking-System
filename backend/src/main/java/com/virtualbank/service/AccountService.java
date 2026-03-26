package com.virtualbank.service;

import com.virtualbank.dto.TransactionRequest;
import com.virtualbank.dto.TransferRequest;
import com.virtualbank.entity.Account;
import com.virtualbank.entity.Transaction;
import com.virtualbank.repository.AccountRepository;
import com.virtualbank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Account> getUserAccounts(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    @Transactional
    public Account deposit(TransactionRequest request) {
        if(request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Deposit amount must be positive");
        }
        
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setBalance(account.getBalance().add(request.getAmount()));
        Account updatedAccount = accountRepository.save(account);

        createTransaction(account, request.getAmount(), "DEPOSIT", null);

        return updatedAccount;
    }

    @Transactional
    public Account withdraw(TransactionRequest request) {
        if(request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Withdraw amount must be positive");
        }
        
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if(account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds");
        }
        
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        Account updatedAccount = accountRepository.save(account);

        createTransaction(account, request.getAmount(), "WITHDRAW", null);

        return updatedAccount;
    }

    @Transactional
    public void transfer(TransferRequest request) {
        if(request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        Account sourceAccount = accountRepository.findById(request.getSourceAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        if(sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds for transfer");
        }

        Account targetAccount = accountRepository.findByAccountNumber(request.getTargetAccountNumber())
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        if(sourceAccount.getId().equals(targetAccount.getId())) {
            throw new RuntimeException("Cannot transfer to the same account");
        }

        // Deduct from source
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        accountRepository.save(sourceAccount);
        createTransaction(sourceAccount, request.getAmount(), "TRANSFER_OUT", targetAccount.getAccountNumber());

        // Add to target
        targetAccount.setBalance(targetAccount.getBalance().add(request.getAmount()));
        accountRepository.save(targetAccount);
        createTransaction(targetAccount, request.getAmount(), "TRANSFER_IN", sourceAccount.getAccountNumber());
    }

    public List<Transaction> getTransactionHistory(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTimestampDesc(accountId);
    }

    private void createTransaction(Account account, BigDecimal amount, String type, String targetAccountNumber) {
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setTargetAccountNumber(targetAccountNumber);
        transactionRepository.save(transaction);
    }
}
