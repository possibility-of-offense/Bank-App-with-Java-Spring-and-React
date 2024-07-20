package com.example.demo.service;

import com.example.demo.entity.Transfer;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TransferService {
    List<Transfer> findAllByAccountId(int accountId);

    Page<Transfer> findTransfers(int accountId, int page, int size);

    Transfer findById(int id);

    Boolean createTransfer(int accountId, int beneficiaryAccountId, Double amount, String type);
}
