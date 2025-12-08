package com.oraclejava.longlife.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "exercise_goal")
public class ExerciseGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_goal_id")
    private Long exerciseGoalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "weight_goal")
    private Integer weightGoal;

    @Column(name = "count_goal")
    private Integer countGoal;

    @Column(name = "distance_goal")
    private String distanceGoal;

    @Column(name = "time_goal")
    private String timeGoal;

    @Column(name = "starting_date")
    private LocalDate startingDate;

    @Column(name = "complete_date")
    private LocalDate completeDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    public void update(Exercise exercise, Integer weightGoal, Integer countGoal, String distanceGoal, String timeGoal,
                       LocalDate startingDate, LocalDate completeDate, Status status){
        this.exercise = exercise;
        this.weightGoal = weightGoal;
        this.countGoal = countGoal;
        this.distanceGoal = distanceGoal;
        this.timeGoal = timeGoal;
        this.startingDate = startingDate;
        this.completeDate = completeDate;
        this.status = status;
    }

}
