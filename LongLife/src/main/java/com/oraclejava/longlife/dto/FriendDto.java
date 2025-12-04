package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record FriendDto(
        Long friendId,
        String requesterId,
        String requesterName,
        String receiverId,
        String receiverName,
        String status,
        LocalDateTime createdAt
) {
}
