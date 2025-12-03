package com.oraclejava.longlife.dto;

public record ExerciseDto(
        Long exerciseId,
        String type1,
        String type2,
        String name,
        String description
) {
}
