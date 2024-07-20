package com.example.demo.dao;

import com.example.demo.entity.Transfer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Integer>  {
    List<Transfer> findAllByAccountId(int accountId);

    @Query(value = "SELECT t FROM Transfer t WHERE t.account.id = :accountId")
    Page<Transfer> findAllProjected(int accountId, Pageable pageable);
}
