package com.example.demo.rest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestControllerAdvice
public class AccountRestExceptionHandler {
    // Catch all
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handler(MethodArgumentNotValidException exception) {

        // Get all errors
        List<String> errors = exception.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());

        // Response to return
        Map<String, List<String>> response = new HashMap<>();

        // Append error message
        response.put("errors", errors);

        // List with the field errors
        List<String> fieldErrors = new ArrayList<>(List.of());

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            fieldErrors.add(error.getField());
        });

        // Append fieldsErrors list
        response.put("fields", fieldErrors);

        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
}
