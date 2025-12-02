package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.WorkoutSessionDto;
import com.oraclejava.longlife.dto.WorkoutSessionRequest;
import com.oraclejava.longlife.model.Exercise;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.model.WorkoutSession;
import com.oraclejava.longlife.repo.ExerciseRepo;
import com.oraclejava.longlife.repo.UsersRepository;
import com.oraclejava.longlife.repo.WorkoutSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Service
public class WorkoutSessionService {
    private final WorkoutSessionRepository workoutSessionRepo;
    private final ExerciseRepo exerciseRepo;
    private final UsersRepository usersRepository;

    // 해당 날짜의 운동일지
    public List<WorkoutSessionRequest> findDateSession(LocalDate date, String loginUser) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return workoutSessionRepo.findDateSession(loginUser, startOfDay, endOfDay);
    }

    // 단일 운동일지 조회
    public WorkoutSessionDto findById(Long id) {
        WorkoutSession session = workoutSessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("session not found"));

        return new WorkoutSessionDto(
                session.getExercise().getName(),
                session.getNote(),
                session.getLocation(),
                session.getStartedAt(),
                session.getEndedAt()
        );
    }

    // 운동일지가 존재하는 월
    public List<String> findMonthSession(int year, int month) {
        List<WorkoutSession> session = workoutSessionRepo.findMonthSession(year, month);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return session.stream()
                .map(s -> s.getStartedAt().toLocalDate().format(formatter))
                .distinct()
                .collect(Collectors.toList());
    }

    // 운동일지 추가
    public WorkoutSession saveSession(WorkoutSessionRequest request,
                                      Authentication authentication) {
        Exercise exercise = exerciseRepo.findByName(request.exerciseName())
                .orElseThrow(() -> new RuntimeException("exercise not found"));

        String username = authentication.getName();
        Users users = usersRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("user not found"));
        WorkoutSession workoutSession = new WorkoutSession();
        workoutSession.setUsers(users);
        workoutSession.setExercise(exercise);
        workoutSession.setNote(request.note());
        workoutSession.setLocation(request.location());
        workoutSession.setStartedAt(request.startedAt());
        workoutSession.setEndedAt(request.endedAt());

        return workoutSessionRepo.save(workoutSession);
    }

    // 운동일지 수정
    public WorkoutSession updateSession(long id, WorkoutSessionRequest request) {
        WorkoutSession updateSession = workoutSessionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("session not found"));

        Exercise exercise = exerciseRepo.findByName(request.exerciseName())
                .orElseThrow(() -> new RuntimeException("exercise not found"));

        updateSession.update(request.startedAt(), request.endedAt(), request.location(), request.note(), exercise);

        return workoutSessionRepo.save(updateSession);
    }

    public void deleteSession(long id) {
        workoutSessionRepo.deleteById(id);
    }


}
