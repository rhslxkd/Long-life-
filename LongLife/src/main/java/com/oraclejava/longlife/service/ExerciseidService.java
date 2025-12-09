package com.oraclejava.longlife.service;

import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.repo.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseidService {

    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getExerciseId(){

        return exerciseRepository.findAll();

    }


}
