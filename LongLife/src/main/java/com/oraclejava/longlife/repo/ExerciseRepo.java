package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ExerciseRepo extends JpaRepository<Exercise, Long> {
    Optional<Exercise> findByName(String name);
}
