package com.example.demo.rest;

public class TransferErrorResponse {
    private int status;
    private String message;
    private String field;

    public TransferErrorResponse() {}

    public TransferErrorResponse(int status, String message, String field) {
        this.status = status;
        this.message = message;
        this.field = field;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }
}
