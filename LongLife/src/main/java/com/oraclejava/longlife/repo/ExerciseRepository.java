package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    Optional<Exercise> findByName(String name);

    @Query("""
        select e from Exercise e
        where (:type1 is null or e.type1 = :type1)
        and (:type2 is null or e.type2 = :type2)
        and (:name is null or e.name = :name)
        order by e.exerciseId desc
    """)
    List<Exercise> search(@Param("type1") String type1,
                          @Param("type2") String type2,
                          @Param("name") String name);


}
