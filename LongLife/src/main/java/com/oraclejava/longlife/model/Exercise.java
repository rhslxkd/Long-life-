package com.oraclejava.longlife.model;

import com.oraclejava.longlife.base.IEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;

    private String type1;

    private String type2;

    private String name;

    private String description;
}
