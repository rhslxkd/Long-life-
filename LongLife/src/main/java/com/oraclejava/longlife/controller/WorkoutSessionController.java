package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.WorkoutSessionDto;
import com.oraclejava.longlife.dto.WorkoutSessionRequest;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.model.WorkoutSession;
import com.oraclejava.longlife.service.WorkoutSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/workout")
public class WorkoutSessionController {
    private final WorkoutSessionService workoutSessionService;

    // 해당 날짜의 운동일지
    @GetMapping("/session/{date}")
    public List<WorkoutSessionRequest> findDateSession(@PathVariable("date") LocalDate date,
                                                   Authentication authentication) {
        LocalDate today = LocalDate.now();
        if(date.isAfter(today)) {
            throw  new IllegalArgumentException("잘못된 날짜 접근입니다.");
        }
        String loginUser = authentication.getName();
        return workoutSessionService.findDateSession(date, loginUser);
    }

    // 전체 운동일지
    @GetMapping("/homeSession")
    public List<WorkoutSession> findHomeSession(Authentication authentication) {
        String loginUser = authentication.getName();
        return workoutSessionService.findTop5ByOrderByStartedAtDesc(loginUser);
    }

    // 운동일지가 존재하는 월
    @GetMapping("/dates")
    public List<String> findMonthSession(@RequestParam int year, @RequestParam int month, Authentication authentication) {
        String userId = authentication.getName();
        return workoutSessionService.findMonthSession(year, month, userId);
    }


    // 운동일지 추가
    @PostMapping("/createSession")
    public WorkoutSession createSession(@RequestBody WorkoutSessionRequest request,
                                        Authentication authentication) {
        return workoutSessionService.saveSession(request, authentication);
    }

    // 단일 운동일지 조회
    @GetMapping("/updateSession/{sessionId}")
    public WorkoutSessionDto getSession(@PathVariable("sessionId") Long sessionId) {
        return workoutSessionService.findById(sessionId);
    }

    // 운동일지 수정
    @PutMapping("/updateSession/{sessionId}")
    public WorkoutSession updateSession(@PathVariable("sessionId") Long sessionId,
                                        @RequestBody WorkoutSessionRequest request) {
        WorkoutSession updateSession = workoutSessionService.updateSession(sessionId, request);
        return updateSession;
    }

    // 운동일지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable("id") Long id) {
        workoutSessionService.deleteSession(id);
        return ResponseEntity.ok().build();
    }


}
