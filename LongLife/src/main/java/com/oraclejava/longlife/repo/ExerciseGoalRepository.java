package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.dto.ExerciseGoalDto;
import com.oraclejava.longlife.model.ExerciseGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExerciseGoalRepository extends JpaRepository<ExerciseGoal, Long> {

    @Query("""
            select new com.oraclejava.longlife.dto.ExerciseGoalDto(
                        u.userId, e.name, g.exerciseGoalId, g.weightGoal, g.countGoal, g.distanceGoal, g.timeGoal, g.startingDate, g.completeDate, g.status)
            from ExerciseGoal g join g.exercise e
                        join g.users u
            where u.userId = :userId
            """)
    List<ExerciseGoalDto> findExerciseGoalByUserId(@Param("userId") String userId);


}
