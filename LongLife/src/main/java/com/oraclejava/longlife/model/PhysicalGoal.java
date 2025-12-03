package com.oraclejava.longlife.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter

@Table(name = "physical_goal")
public class KgGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kgGoal_id")
    private int kgGoalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "kg")
    private int kgGoal;

    @Column(name = "starting_date")
    private LocalDate startingDate;

    @Column(name = "complete_date")
    private LocalDate completeDate;

    @Enumerated(EnumType.STRING)
    private Status status;
}
