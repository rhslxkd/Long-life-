package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.PhysicalGoalDto;
import com.oraclejava.longlife.model.PhysicalGoal;
import com.oraclejava.longlife.repo.PhysicalGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class PhysicalGoalService {
    private final PhysicalGoalRepository physicalGoalRepository;

    // 체중목표 조회
    public List<PhysicalGoalDto> findPhysicalGoalByUserId(String userId){
        return physicalGoalRepository.findPhysicalGoalByUserId(userId);
    }

    // 체중목표 추가
    public PhysicalGoal savePhysicalGoal(PhysicalGoal physicalGoal){
        return physicalGoalRepository.save(physicalGoal);
    }

    // 체중목표 수정

}
