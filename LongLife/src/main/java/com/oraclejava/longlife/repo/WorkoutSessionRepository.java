package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.dto.WorkoutSessionDto;
import com.oraclejava.longlife.dto.WorkoutSessionRequest;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {


    @Query("""
            select w.sessionId, e.name, w.note, w.location, w.startedAt, w.endedAt
            from WorkoutSession w join w.exercise e where w.users.userId = :user and
                        w.startedAt between :startOfDay and :endOfDay order by w.endedAt
            """
    )
    List<WorkoutSessionRequest> findDateSession(@Param("user") String userId,
                                                @Param("startOfDay") LocalDateTime startOfDay,
                                                @Param("endOfDay") LocalDateTime endOfDay);

    @Query("""
            select ws from WorkoutSession ws
            where YEAR(ws.startedAt) = :year and MONTH(ws.startedAt) = :month
            """)
    List<WorkoutSession> findMonthSession(@Param("year") int year, @Param("month") int month);
}
