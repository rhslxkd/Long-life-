package com.oraclejava.longlife.dto;

public record CommentRequestDto(
        Long postId,
        String userId,
        String content,
        Long parentId
) {
}
