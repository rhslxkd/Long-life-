package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.RegisterRequest;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UsersController {
    private final UsersService usersService;
    private final Users adminUser;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterRequest request) {
        usersService.register(request);
        return ResponseEntity.ok().build();
    }

    // 아이디 중복체크
    @GetMapping("duplicate-check")
    public Map<String, Boolean> duplicateCheck(@RequestParam String userId) {
        boolean exists = usersService.duplicateCheck(userId);
        return Map.of("available", !exists);
    }
}
