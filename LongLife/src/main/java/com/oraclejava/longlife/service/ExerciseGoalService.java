package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.ExerciseGoalDto;
import com.oraclejava.longlife.repo.ExerciseGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class ExerciseGoalService {
    private final ExerciseGoalRepository goalRepo;

    // 운동목표 조회
    public List<ExerciseGoalDto> findExerciseGoalByUserId(String userId){
        return goalRepo.findExerciseGoalByUserId(userId);
    }



    // 운동목표 추가

}
