package com.example.demo.service;

import com.example.demo.entity.Account;

import java.util.List;

public interface AccountService {
    List<Account> findAll();

    List<Account> findAccounts(int page, int size);

    Account findById(int id);

    Account save(Account account);

    Account findByIban(String iban);

    void update(Account account);

    void deleteById(int id);

    Long countDocuments();
}
