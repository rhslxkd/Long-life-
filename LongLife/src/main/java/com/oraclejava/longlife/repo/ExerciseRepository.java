package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    @Query("""
     SELECT e FROM Exercise e 
     WHERE 1=1 
     order by e.exerciseId asc
   """)
    List<Exercise> findAll();
}
