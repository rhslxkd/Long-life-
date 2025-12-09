package com.oraclejava.longlife.dto;

import com.oraclejava.longlife.model.Status;

import java.time.LocalDate;

public record ExerciseGoalDto(
        String userId,
        String name,
        Long exerciseGoalId,
        Integer weightGoal,
        Integer countGoal,
        String distanceGoal,
        String timeGoal,
        LocalDate startingDate,
        LocalDate completeDate,
        Status status
) {
}
