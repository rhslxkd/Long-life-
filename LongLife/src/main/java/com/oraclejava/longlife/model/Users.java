package com.oraclejava.longlife.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Users {
    @Id
    @Column(name = "user_id")
    private String userId;
    private String email;
    private String name;
    private String password;
    private String address;
    private int height;
    private int weight;
    private LocalDateTime regdate;
    private String role;
}
