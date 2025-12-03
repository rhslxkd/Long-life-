package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.ExerciseDto;
import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.repo.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public List<ExerciseDto> getAll(String type1, String type2, String name) {
        List<Exercise> exerciseList = exerciseRepository.search(type1, type2, name);

        return exerciseList.stream()
                .map(exercise -> new ExerciseDto(
                        exercise.getExerciseId(),
                        exercise.getType1(),
                        exercise.getType2(),
                        exercise.getName(),
                        exercise.getDescription()
                ))
                .toList();
    }

    // 운동 등록
    public ExerciseDto addExercise(ExerciseDto exerciseDto) {
        Exercise exercise = new Exercise();
        exercise.setType1(exerciseDto.type1());
        exercise.setType2(exerciseDto.type2());
        exercise.setName(exerciseDto.name());
        exercise.setDescription(exerciseDto.description());

        Exercise saved = exerciseRepository.save(exercise);
        return new ExerciseDto(
                saved.getExerciseId(),
                saved.getType1(),
                saved.getType2(),
                saved.getName(),
                saved.getDescription());
    }

    // 운동 종목 수정
    public ExerciseDto updateExercise(Long exerciseId, ExerciseDto exerciseDto) {
        Exercise uexercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("운동 종목을 찾을 수 없습니다."));
        uexercise.setType1(exerciseDto.type1());
        uexercise.setType2(exerciseDto.type2());
        uexercise.setName(exerciseDto.name());
        uexercise.setDescription(exerciseDto.description());

        Exercise saved = exerciseRepository.save(uexercise);
        return new ExerciseDto(
                saved.getExerciseId(),
                saved.getType1(),
                saved.getType2(),
                saved.getName(),
                saved.getDescription());
    }

    // 운동 종목 삭제
    public void deleteExercise(Long exerciseId) {
        exerciseRepository.deleteById(exerciseId);
    }
}
