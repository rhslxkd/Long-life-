package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.PhysicalGoalDto;
import com.oraclejava.longlife.model.PhysicalGoal;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import com.oraclejava.longlife.service.PhysicalGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/physical")
public class PhysicalGoalController {
    private final PhysicalGoalService physicalGoalService;
    private final UsersRepository usersRepository;

    @GetMapping("/goal")
    public List<PhysicalGoalDto> findKgGoalByUserId(Authentication authentication) {
        String userId = authentication.getName();
        return physicalGoalService.findPhysicalGoalByUserId(userId);
    }

    @PostMapping("/createGoal")
    public PhysicalGoal createPhysicalGoal(@RequestBody PhysicalGoal physicalGoal,
                                           Authentication authentication) {
        String userId = authentication.getName();
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        physicalGoal.setUsers(user);
        return physicalGoalService.savePhysicalGoal(physicalGoal);
    }
}
