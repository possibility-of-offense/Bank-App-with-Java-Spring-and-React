package com.example.demo.validators;

import com.example.demo.rest.StatusEnum;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class StatusValidatorImpl implements ConstraintValidator<StatusValidator, String> {

    @Override
    public void initialize(StatusValidator status) {
    }

    @Override
    public boolean isValid(String status, ConstraintValidatorContext context) {
        System.out.println(status);

        if (status == null) {
            return false;
        }


        try {
            StatusEnum.valueOf(status.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
