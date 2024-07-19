package com.example.demo.entity;

import com.example.demo.rest.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Id")
    private int id;

    @NotEmpty(message = "Name must not be empty")
    @Column(name="Name", nullable = false)
    private String name;

    @NotEmpty(message = "IBAN must not be empty")
    @Column(name="IBAN", nullable = false)
    private String iban;

    @Enumerated(EnumType.STRING)
    @Column(name="Status", nullable = false)
    private StatusEnum status;

    @NotNull(message = "Available Amount should be 0 at least!")
    @Min(value = 0, message = "Available Amount should be 0 at least!")
    @Column(name="AvailableAmount", nullable = false)
    private Double availableAmount;

    @Column(name="CreatedOn")
    private Date createdOn;

    @Column(name="ModifiedOn")
    private Date modifiedOn;

    @PrePersist
    protected void onCreate() {
        createdOn = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        modifiedOn = new Date();
    }

    @OneToMany(mappedBy = "account")
    private List<Transfer> transfers;

    @OneToMany(mappedBy = "beneficiaryAccount")
    private List<Transfer> benefiacyAccounts;

    public Account() {}

    public Account(String name, String iban, StatusEnum status, Double availableAmount, Date createdOn, Date modifiedOn) {
        this.name = name;
        this.iban = iban;
        this.status = status;
        this.availableAmount = availableAmount;
        this.createdOn = createdOn;
        this.modifiedOn = modifiedOn;
    }

    // Getters / setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    public Double getAvailableAmount() {
        return availableAmount;
    }

    public void setAvailableAmount(Double availableAmount) {
        this.availableAmount = availableAmount;
    }

    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }

    public Date getModifiedOn() {
        return modifiedOn;
    }

    public void setModifiedOn(Date modifiedOn) {
        this.modifiedOn = modifiedOn;
    }

    // toString
    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", iban='" + iban + '\'' +
                ", status='" + status + '\'' +
                ", availableAmount=" + availableAmount +
                ", createdOn=" + createdOn +
                ", modifiedOn=" + modifiedOn +
                '}';
    }
}
