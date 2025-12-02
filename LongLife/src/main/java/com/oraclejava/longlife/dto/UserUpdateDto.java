package com.oraclejava.longlife.dto;

public record UserUpdateDto(
        String email,
        String name,
        String address,
        int height,
        int weight
) {
}
