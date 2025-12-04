package com.oraclejava.longlife.service;


import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.repo.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    //Exercise 전체 항목 가져오기
    public List<Exercise> getExerciseById() {
       return exerciseRepository.findAll();
    }

}
