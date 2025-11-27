package com.oraclejava.longlife.dto;

public record LoginRequest(
        String userId,
        String password
) {
}
