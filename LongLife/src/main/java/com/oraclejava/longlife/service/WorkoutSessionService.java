package com.oraclejava.longlife.service;

import com.oraclejava.longlife.repo.WorkoutSessionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@RequiredArgsConstructor
@Service
public class WorkoutSessionService{
    private final WorkoutSessionRepo workoutSessionRepo;
}
