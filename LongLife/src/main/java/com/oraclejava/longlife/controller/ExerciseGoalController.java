package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.ExerciseGoalDto;
import com.oraclejava.longlife.service.ExerciseGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exercise")
public class ExerciseGoalController {
    public final ExerciseGoalService goalService;

    @GetMapping("/goal")
    public List<ExerciseGoalDto> findExerciseGoal(Authentication authentication) {
        String userId = authentication.getName();
        return goalService.findExerciseGoalByUserId(userId);
    }



}
