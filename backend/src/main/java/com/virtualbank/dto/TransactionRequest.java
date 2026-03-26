package com.virtualbank.dto;

import java.math.BigDecimal;

public class TransactionRequest {
    private Long accountId;
    private BigDecimal amount;

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
