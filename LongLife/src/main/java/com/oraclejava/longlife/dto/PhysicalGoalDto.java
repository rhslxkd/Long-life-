package com.oraclejava.longlife.dto;

import com.oraclejava.longlife.model.Status;

import java.time.LocalDate;

public record PhysicalGoalDto(
        Long physicalGoalId,
        String userId,
        Integer weight,
        Integer height,
        Integer kgGoal,
        LocalDate startingDate,
        LocalDate completeDate,
        Status status
) {
}
