package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.ExerciseDto;
import com.oraclejava.longlife.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exercise")
public class ExerciseController {
    private final ExerciseService exerciseService;

    // 운동 종목 목록
    @GetMapping
    public ResponseEntity<List<ExerciseDto>> getExercises(@RequestParam(required = false) String type1,
                                                          @RequestParam(required = false) String type2,
                                                          @RequestParam(required = false) String name) {
        System.out.println("type1: "+ type1 + ", type2: " + type2 + ", name: " + name);
        return ResponseEntity.ok(exerciseService.getAll(type1, type2, name));
    }

    // 운동 종목 등록
    @PostMapping
    public ResponseEntity<ExerciseDto> createExercise(@RequestBody ExerciseDto exerciseDto) {
        return ResponseEntity.ok(exerciseService.addExercise(exerciseDto));
    }

    // 운동 종목 수정
    @PutMapping("/{exerciseId}")
    public ResponseEntity<ExerciseDto> updateExercise(@PathVariable("exerciseId") Long exerciseId,
                                                      @RequestBody ExerciseDto exerciseDto) {
        return ResponseEntity.ok(exerciseService.updateExercise(exerciseId, exerciseDto));
    }

    // 운동 종목 삭제
    @DeleteMapping("/{exerciseId}")
    public ResponseEntity<ExerciseDto> deleteExercise(@PathVariable("exerciseId") Long exerciseId) {
        exerciseService.deleteExercise(exerciseId);
        return ResponseEntity.ok().build();
    }
}
