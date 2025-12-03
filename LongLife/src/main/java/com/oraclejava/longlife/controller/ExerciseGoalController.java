package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.ExerciseGoalDto;
import com.oraclejava.longlife.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/goal")
public class GoalController {
    public final GoalService goalService;

    @GetMapping("/exercise")
    public List<ExerciseGoalDto> findExerciseGoal(Authentication authentication) {
        String userId = authentication.getName();
        return goalService.findExerciseGoalByUserId(userId);
    }

//    @GetMapping("/kg")
//    public List<KgGoalDto> findKgGoalByUserId(Authentication authentication) {
//        String userId = authentication.getName();
//        return goalService.findKgGoalByUserId(userId);
//    }

}
