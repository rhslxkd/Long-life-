package com.oraclejava.longlife.dto;
import java.time.LocalDateTime;

public record PostUpdateDto(
        Long exerciseId,
        String title,
        String content,
        LocalDateTime updatedAt
) {
}
