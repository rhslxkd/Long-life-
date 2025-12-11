package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record LikesDto(
        long likeId,
        long postId,
        String userId,
        LocalDateTime createdAt,
        boolean isLike
) {
}
