package com.oraclejava.longlife.dto;

import com.oraclejava.longlife.model.Exercise;

import java.util.List;

public record ExerciseInitResponse(
        List<ExerciseDto> exercises,
        List<String> type1List,
        List<String> type2List
        ) {
}
