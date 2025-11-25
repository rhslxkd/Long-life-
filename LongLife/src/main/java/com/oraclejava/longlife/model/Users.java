package com.oraclejava.longlife.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private String userId;

    private String email;

    private String name;

    private String password;

    private String address;

    private LocalDateTime regdate;

    private int height;

    private int weight;
}
