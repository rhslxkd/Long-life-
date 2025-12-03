package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.dto.PhysicalGoalDto;
import com.oraclejava.longlife.model.PhysicalGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhysicalGoalRepository extends JpaRepository<PhysicalGoal, Long> {
    @Query("""
            select new com.oraclejava.longlife.dto.PhysicalGoalDto(
                        u.userId, u.weight, u.height, g.kgGoal, g.startingDate, g.completeDate, g.status)
            from PhysicalGoal g join g.users u
            where u.userId=:userId
            """)
    List<PhysicalGoalDto> findPhysicalGoalByUserId(@Param("userId") String userId);
}
