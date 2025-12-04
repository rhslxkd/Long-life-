package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record WorkoutSessionRequest(
        Long sessionId,
        String exerciseName,
        String note,
        String location,
        LocalDateTime startedAt,
        LocalDateTime endedAt) {
}
