package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.WorkoutSessionDto;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.service.WorkoutSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class WorkoutSessionController {
    private final WorkoutSessionService workoutSessionService;
    private final Users adminUser;

    @GetMapping("/info")
    public String info() {
        return adminUser.getUserId();
    }

    @GetMapping("/api/workout/session/{date}")
    public List<WorkoutSessionDto> findDateSession(@PathVariable LocalDate date) {
        return workoutSessionService.findDateSession(date);
    }





}
