package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.WorkoutSessionDto;
import com.oraclejava.longlife.repo.WorkoutSessionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Transactional
@RequiredArgsConstructor
@Service
public class WorkoutSessionService{
    private final WorkoutSessionRepo workoutSessionRepo;

    // 해당 날짜의 운동일지
    public List<WorkoutSessionDto> findDateSession(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return workoutSessionRepo.findDateSession(startOfDay, endOfDay);
    }

    // 운동일지 추가




}
