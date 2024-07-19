package com.example.demo.rest;

import com.example.demo.entity.Account;
import com.example.demo.entity.AccountChangeStatus;
import com.example.demo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/account")
public class AccountRestController {

    // Account Service
    private final AccountService accountService;

    @Autowired
    public AccountRestController(AccountService accService) {
        accountService = accService;
    }

    // return all accounts
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/show-accounts")
    public List<Account> showAccounts(@RequestParam(required = false) String size, @RequestParam(required = false) String page) {
        if(size != null) {
            return accountService.findAccounts(Integer.parseInt(page), Integer.parseInt(size));
        } else {
            return accountService.findAccounts(0, 10);
        }
    }

    // return number of all accounts documnets
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/count-documents")
    public Long countDocuments() {
        return accountService.countDocuments();
    }

    // return single account
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{accountId}")
    public Account getAccount(@PathVariable int accountId) {
        Account account = accountService.findById(accountId);

        if(account == null) {
            throw new RuntimeException("The account is not found!");
        }

        return account;
    }

    // save account
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add-account")
    public Account addAcccount(@RequestBody @Valid Account account) {
        // If the id was accidentally passed
        account.setId(0);

        Account getAccount = accountService.findByIban(account.getIban());

        if(getAccount != null) {
            throw new RuntimeException("IBAN is not unique!");
        } else {
            return accountService.save(account);
        }
    }

    // Freeze account
    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/change-status")
    public Boolean changeStatus(@RequestBody AccountChangeStatus accountToUpdate) {
        Account findAccount = accountService.findById(accountToUpdate.getAccountId());

        if(findAccount != null) {
            // If the status is active, change to freeze
            // Otherwise the opposite - change to active
            if(findAccount.getStatus().equals(StatusEnum.active)) {
                findAccount.setStatus(StatusEnum.freeze);
                accountService.update(findAccount);
            } else if(findAccount.getStatus().equals(StatusEnum.freeze)) {
                findAccount.setStatus(StatusEnum.active);
                accountService.update(findAccount);
            }
            return true;
        }

        return false;
    }

    // update account
    @PutMapping("/update-account")
    public Account updateAccount(@RequestBody Account account) {
        return accountService.save(account);
    }
}
