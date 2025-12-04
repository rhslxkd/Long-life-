package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping("/exercise")
    public List<Exercise> exerciseList(){
       return exerciseService.getExerciseById();
    }

}
