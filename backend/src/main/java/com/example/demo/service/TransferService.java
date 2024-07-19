package com.example.demo.service;

import com.example.demo.entity.Transfer;

import java.util.List;

public interface TransferService {
    List<Transfer> findAllByAccountId(int accountId);

    Transfer findById(int id);

    Boolean createTransfer(int accountId, int beneficiaryAccountId, Double amount, String type);
}
