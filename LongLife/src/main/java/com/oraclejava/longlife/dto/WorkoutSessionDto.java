package com.oraclejava.longlife.dto;

import java.time.LocalDateTime;

public record WorkoutSessionDto(
        String exerciseName,
        String note,
        String location,
        LocalDateTime startedAt,
        LocalDateTime endedAt) {
}
