package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record ForAdminUserDto(
        String userId,
        String email,
        String name,
        LocalDateTime regdate
) {
}
