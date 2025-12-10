package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record ForAdminPostDto(
        long postId,
        String userId,
        String title,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
