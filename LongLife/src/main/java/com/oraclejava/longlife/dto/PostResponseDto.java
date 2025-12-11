package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record PostResponseDto(
        long postId,
        String writer,
        String exercise,
        String title,
        String content,
        LocalDateTime createdAt,
        int viewCount,
        String imgUrl,
        boolean likedByUser,
        long likeCount
) {
}
