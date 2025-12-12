package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.ExerciseGoalDto;
import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.model.ExerciseGoal;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.ExerciseGoalRepository;
import com.oraclejava.longlife.repo.ExerciseRepository;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class ExerciseGoalService {
    private final ExerciseGoalRepository exerciseGoalRepository;
    private final ExerciseRepository exerciseRepository;
    private final UsersRepository usersRepository;

    // 운동목표 조회
    public List<ExerciseGoalDto> findExerciseGoalByUserId(String userId) {
        return exerciseGoalRepository.findExerciseGoalByUserId(userId);
    }

    // 운동목표 추가
    public ExerciseGoal saveExerciseGoal(ExerciseGoalDto exerciseGoalDto, Authentication authentication) {
        Exercise exercise = exerciseRepository.findByName(exerciseGoalDto.name())
                .orElseThrow(() -> new RuntimeException("exercise not found"));

        String username = authentication.getName();
        Users users = usersRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("user not found"));
        ExerciseGoal exerciseGoal = new ExerciseGoal();
        exerciseGoal.setExercise(exercise);
        exerciseGoal.setUsers(users);
        exerciseGoal.setWeightGoal(exerciseGoalDto.weightGoal());
        exerciseGoal.setCountGoal(exerciseGoalDto.countGoal());
        exerciseGoal.setDistanceGoal(exerciseGoalDto.distanceGoal());
        exerciseGoal.setTimeGoal(exerciseGoalDto.timeGoal());
        exerciseGoal.setStartingDate(exerciseGoalDto.startingDate());
        exerciseGoal.setCompleteDate(exerciseGoalDto.completeDate());
        exerciseGoal.setStatus(exerciseGoalDto.status());

        return exerciseGoalRepository.save(exerciseGoal);
    }

    public ExerciseGoalDto findById(Long id) {
        ExerciseGoal exerciseGoal = exerciseGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("exerciseGoal not found"));

        return new ExerciseGoalDto(
                exerciseGoal.getUsers().getUserId(),
                exerciseGoal.getExercise().getName(),
                exerciseGoal.getExerciseGoalId(),
                exerciseGoal.getWeightGoal(),
                exerciseGoal.getCountGoal(),
                exerciseGoal.getDistanceGoal(),
                exerciseGoal.getTimeGoal(),
                exerciseGoal.getStartingDate(),
                exerciseGoal.getCompleteDate(),
                exerciseGoal.getStatus()
        );
    }

    public ExerciseGoal updateExerciseGoal(long id, ExerciseGoalDto exerciseGoalDto) {
        ExerciseGoal updateExerciseGoal = exerciseGoalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("exerciseGoal not found"));

        Exercise exercise = exerciseRepository.findByName(exerciseGoalDto.name())
                .orElseThrow(() -> new RuntimeException("exercise not found"));
        updateExerciseGoal.update(exercise, exerciseGoalDto.weightGoal(), exerciseGoalDto.countGoal(),
                exerciseGoalDto.distanceGoal(), exerciseGoalDto.timeGoal(),
                exerciseGoalDto.startingDate(), exerciseGoalDto.completeDate(),
                exerciseGoalDto.status());
        return exerciseGoalRepository.save(updateExerciseGoal);
    }

    public void deleteExerciseGoal(long id) {
        exerciseGoalRepository.deleteById(id);
    }
}
