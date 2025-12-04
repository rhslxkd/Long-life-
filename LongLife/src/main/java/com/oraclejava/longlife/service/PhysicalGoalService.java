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
    public PhysicalGoalDto findPhysicalGoalByUserId(String userId){
        return physicalGoalRepository.findPhysicalGoalByUserId(userId);
    }

    // 체중목표 추가
    public PhysicalGoal savePhysicalGoal(PhysicalGoal physicalGoal){
        return physicalGoalRepository.save(physicalGoal);
    }

    // 체중목표 수정
    public PhysicalGoal updatePhysicalGoal(Long id, PhysicalGoal physicalGoal){
        PhysicalGoal uPhysicalGoal = physicalGoalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("not found"));

        uPhysicalGoal.update(physicalGoal.getKgGoal(), physicalGoal.getStartingDate(),physicalGoal.getCompleteDate(),physicalGoal.getStatus());
        return physicalGoalRepository.save(uPhysicalGoal);
    }

    // 체중목표 삭제
    public void deletePhysicalGoal(Long id){
        physicalGoalRepository.deleteById(id);
    }

}
