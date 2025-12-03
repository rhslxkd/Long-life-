package com.oraclejava.longlife.dto;

import com.oraclejava.longlife.model.Status;

import java.time.Duration;
import java.time.LocalDate;

public record GoalDto(
        String userId,
        String name,
        int weightGoal,
        int kgGoal,
        int countGoal,
        int distanceGoal,
        int timeGoal,
        LocalDate startingDate,
        LocalDate completeDate,
        Status status
) {
}
