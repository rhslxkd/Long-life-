package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.ExerciseGoalDto;
import com.oraclejava.longlife.model.ExerciseGoal;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import com.oraclejava.longlife.service.ExerciseGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exercise")
public class ExerciseGoalController {
    public final ExerciseGoalService exerciseGoalService;
    private final UsersRepository usersRepository;

    @GetMapping("/goal")
    public List<ExerciseGoalDto> findExerciseGoal(Authentication authentication) {
        String userId = authentication.getName();
        return exerciseGoalService.findExerciseGoalByUserId(userId);
    }

    @PostMapping("/createGoal")
    public ExerciseGoal createExerciseGoal(@RequestBody ExerciseGoalDto exerciseGoal,
                                           Authentication authentication) {
        return exerciseGoalService.saveExerciseGoal(exerciseGoal, authentication);
    }

    @GetMapping("/goal/{id}")
    public ExerciseGoalDto findExerciseGoalById(@PathVariable Long id) {
        return exerciseGoalService.findById(id);
    }

    @PutMapping("/updateGoal/{id}")
    public ExerciseGoal updateExerciseGoal(@PathVariable Long id, @RequestBody ExerciseGoalDto exerciseGoal) {
        ExerciseGoal updateExerciseGoal = exerciseGoalService.updateExerciseGoal(id, exerciseGoal);
        return updateExerciseGoal;
    }

    @DeleteMapping("/deleteGoal/{id}")
    public ResponseEntity<Void> deleteExerciseGoalById(@PathVariable Long id) {
        exerciseGoalService.deleteExerciseGoal(id);
        return ResponseEntity.ok().build();
    }
}
