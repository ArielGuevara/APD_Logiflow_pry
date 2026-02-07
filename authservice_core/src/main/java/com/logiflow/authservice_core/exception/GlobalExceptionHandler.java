package com.logiflow.authservice_core.exception;

public class GlobalExceptionHandler extends RuntimeException{
    public GlobalExceptionHandler(String message) {
        super(message);
    }
}
