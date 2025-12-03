package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.LoginRequest;
import com.oraclejava.longlife.dto.MeResponse;
import com.oraclejava.longlife.dto.RegisterRequest;
import com.oraclejava.longlife.dto.UserUpdateDto;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import com.oraclejava.longlife.service.UsersService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UsersController {
    private final UsersService usersService;
//    private final Users adminUser;

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

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginRequest req,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        MeResponse meResponse = usersService.login(req, request, response);
        return ResponseEntity.ok().body(meResponse);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,
                                    HttpServletResponse response) {
        usersService.logout(request, response);

        return ResponseEntity.ok().build();
    }
    
    // 유저 정보
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable String userId) {
        return ResponseEntity.ok().body(usersService.getUser(userId));
    }
    
    // 회원 수정
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody UserUpdateDto userUpdateDto) {
        return ResponseEntity.ok().body(usersService.updateUser(userId, userUpdateDto));
    }
    
    // 회원 탈퇴
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId, HttpServletRequest request, HttpServletResponse response) {
        usersService.userDelete(userId, request, response);
        return ResponseEntity.ok().build();
    }
}
