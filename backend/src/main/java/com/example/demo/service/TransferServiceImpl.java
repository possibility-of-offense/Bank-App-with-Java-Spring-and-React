package com.example.demo.service;

import com.example.demo.dao.AccountRepository;
import com.example.demo.dao.TransferRepository;
import com.example.demo.entity.Account;
import com.example.demo.entity.Transfer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransferServiceImpl implements TransferService {
    private final TransferRepository transferRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public TransferServiceImpl(TransferRepository rep, AccountRepository accRep) {
        transferRepository = rep;
        accountRepository = accRep;
    }

    @Override
    public List<Transfer> findAllByAccountId(int accountId) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<Transfer> transfers = transferRepository.findAll(pageable);

        return transferRepository.findAllByAccountId(accountId);
    }

    @Override
    public Page<Transfer> findTransfers(int accountId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Transfer> transfers = transferRepository.findAll(pageable);

        return transferRepository.findAllProjected(accountId, pageable);
    }

    @Override
    public Transfer findById(int id) {
        Optional<Transfer> transfer = transferRepository.findById(id);

        return transfer.orElse(null);
    }

    @Override
    public Boolean createTransfer(int accountId, int beneficiaryAccountId, Double amount, String type) {
        try {
            // Find account and beneficiary account
            Optional<Account> account = accountRepository.findById(accountId);
            Optional<Account> beneficiaryAccount = accountRepository.findById(beneficiaryAccountId);

            // If they are present, return true
            // Otherwise false
            if(account.isPresent() && beneficiaryAccount.isPresent()) {
                // Get account and beneficiary account
                Account getAccount = account.get();
                Account getBeneficiaryAccount = beneficiaryAccount.get();

                // If the account has enough amount to send
                // Extract it from the account and increase the beneficiary account amount
                if(account.get().getAvailableAmount() >= amount) {
                    getAccount.setAvailableAmount(getAccount.getAvailableAmount() - amount);
                    getBeneficiaryAccount.setAvailableAmount(getAccount.getAvailableAmount() + amount);

                    // Create new transfer to be saved
                    Transfer transfer = new Transfer();

                    transfer.setAccount(getAccount);
                    transfer.setBeneficiaryAccount(getBeneficiaryAccount);
                    transfer.setAmount(amount);
                    transfer.setType(type);

                    transferRepository.save(transfer);
                }

                return true;
            } else {
                return false;
            }
        } catch(Exception e) {
            return false;
        }
    }
}
