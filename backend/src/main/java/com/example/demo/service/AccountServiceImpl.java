package com.example.demo.service;

import com.example.demo.dao.AccountRepository;
import com.example.demo.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService{

    private final AccountRepository accountRepository;

    @Autowired
    public AccountServiceImpl(AccountRepository accRep) {
        accountRepository = accRep;
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    @Override
    public List<Account> findAccounts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Account> accounts = accountRepository.findAll(pageable);

        return accounts.getContent();
    }

    @Override
    public Account findById(int id) {
        Optional<Account> result = accountRepository.findById(id);
        Account account = null;

        if(result.isPresent()) {
            account = result.get();
        } else {
            throw new RuntimeException("Could not find account!");
        }

        return account;
    }

    @Override
    public Account findByIban(String iban) {
        return accountRepository.findByIban(iban);
    }

    @Override
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public void update(Account account) {
        accountRepository.save(account);
    }

    @Override
    public void deleteById(int id) {
        accountRepository.deleteById(id);
    }

    @Override
    public Long countDocuments() {
        return accountRepository.count();
    }
}
