package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.model.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WorkoutController {
    private final Users adminUser;

    @GetMapping("/info")
    public String info() {
        return adminUser.getUserId();
    }
}
