package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.service.ExerciseidService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/post")
public class ExerciseidController {

    private final ExerciseidService exerciseidService;

    @GetMapping("/exerciseId")
    public List<Exercise> getAllId(){
        return exerciseidService.getExerciseId();
    }
}
