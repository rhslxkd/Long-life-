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
    @Column(name = "exerciseGoal_id")
    private Long exerciseGoalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "weight_goal")
    private int weightGoal;

    @Column(name = "count_goal")
    private int countGoal;

    @Column(name = "distance_goal")
    private int distanceGoal;

    @Column(name = "time_goal")
    private int timeGoal;

    @Column(name = "starting_date")
    private LocalDate startingDate;

    @Column(name = "complete_date")
    private LocalDate completeDate;

    @Enumerated(EnumType.STRING)
    private Status status;



}
