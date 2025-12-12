package com.oraclejava.longlife.dto;
import java.util.List;

public record CommentResponseDto(
        Long commentId,
        String userId,
        String content,
        String createdAt,
        Long parentId,
        List<CommentResponseDto> children
) {
}
