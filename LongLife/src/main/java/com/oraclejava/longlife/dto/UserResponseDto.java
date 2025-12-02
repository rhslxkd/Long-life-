package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record UserResponseDto(
        String userId,
        String email,
        String name,
        String address,
        int height,
        int weight,
        LocalDateTime regdate
) {
}
