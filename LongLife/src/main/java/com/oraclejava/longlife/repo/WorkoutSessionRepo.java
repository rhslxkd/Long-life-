package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.dto.WorkoutSessionDto;
import com.oraclejava.longlife.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface WorkoutSessionRepo extends JpaRepository<WorkoutSession, Long> {


    @Query("""
            select e.name, w.note, w.location, w.startedAt, w.endedAt
            from WorkoutSession w join w.exercise e where w.startedAt between :startOfDay and :endOfDay
            """
    )
    List<WorkoutSessionDto> findDateSession(@Param("startOfDay") LocalDateTime startOfDay,
                                            @Param("endOfDay") LocalDateTime endOfDay);
}
