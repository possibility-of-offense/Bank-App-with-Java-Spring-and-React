package com.example.demo.entity;

public class CreateTransferRequestBody {
    private Integer accountId;
    private Integer beneficiaryAccountId;
    private Double amount;
    private String type;

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getBeneficiaryAccountId() {
        return beneficiaryAccountId;
    }

    public void setBeneficiaryAccountId(Integer beneficiaryAccountId) {
        this.beneficiaryAccountId = beneficiaryAccountId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
