package com.oraclejava.longlife.model;

import com.oraclejava.longlife.base.IEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name="exercise")
public class Exercise implements IEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="exercise_id")
  private int exerciseId;
  private String description;
  private String type1;
  private String type2;
  private String name;

}
