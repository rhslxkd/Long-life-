package com.oraclejava.longlife.dto;

public record FriendResponseDto(
        Long friendId,
        String receiverId,
        String status
) {
}
