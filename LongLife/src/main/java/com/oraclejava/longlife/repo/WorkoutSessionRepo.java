package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkoutSessionRepo extends JpaRepository<WorkoutSession, Long> {

//    List<WorkoutSession> findAll(@Param("user_id") String user_id);
}
