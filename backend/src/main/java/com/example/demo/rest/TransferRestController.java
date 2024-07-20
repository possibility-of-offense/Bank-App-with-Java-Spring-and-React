package com.example.demo.rest;

import com.example.demo.entity.Transfer;
import com.example.demo.entity.CreateTransferRequestBody;
import com.example.demo.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    // Show transfers for certain accounts | paginate the results by 5
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/show-transfers-by-account-id/{accountId}")
    public Page<Transfer> showTransfersByAccountId(@PathVariable int accountId,
                                                   @RequestParam(required = false) String size,
                                                   @RequestParam(required = false) String page) {
        if(size != null) {
            return transferService.findTransfers(accountId, Integer.parseInt(page), Integer.parseInt(size));
        } else {
            return transferService.findTransfers(accountId, 0, 5);
        }
    }

    // Show transfers by transfer ID
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{transferId}")
    public Transfer showTransfersById(@PathVariable int transferId) {
        return transferService.findById(transferId);
    }
}
