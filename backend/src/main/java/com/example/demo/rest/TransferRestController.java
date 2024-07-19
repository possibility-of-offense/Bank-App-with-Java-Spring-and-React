package com.example.demo.rest;

import com.example.demo.entity.Transfer;
import com.example.demo.entity.CreateTransferRequestBody;
import com.example.demo.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfer")
public class TransferRestController {

    private final TransferService transferService;

    @Autowired
    public TransferRestController(TransferService service) {
        transferService = service;
    }

    // Create transfer
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create-transfer")
    public Boolean addTransfer(@RequestBody CreateTransferRequestBody transfer) {
        return transferService.createTransfer(
                transfer.getAccountId(),
                transfer.getBeneficiaryAccountId(),
                transfer.getAmount(),
                transfer.getType()
        );
    }

    // Show transfers for certain accounts
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/show-transfers-by-account-id/{accountId}")
    public List<Transfer> showTransfersByAccountId(@PathVariable int accountId) {
        return transferService.findAllByAccountId(accountId);
    }

    // Show transfers by transfer ID
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{transferId}")
    public Transfer showTransfersById(@PathVariable int transferId) {
        return transferService.findById(transferId);
    }
}
