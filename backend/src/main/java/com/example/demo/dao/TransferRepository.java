package com.example.demo.dao;

import com.example.demo.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Integer>  {
    List<Transfer> findAllByAccountId(int accountId);
}
