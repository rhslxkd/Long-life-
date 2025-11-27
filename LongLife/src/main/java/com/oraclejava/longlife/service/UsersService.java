package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.RegisterRequest;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    public void register(RegisterRequest request) {
        // 아이디 중복 체크
        if (usersRepository.existsByUserId(request.userId())) {
            throw  new IllegalArgumentException("이미 사용중인 아이디입니다.");
        }

        Users user = new Users();
        user.setUserId(request.userId());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setEmail(request.email());
        user.setAddress(request.address());
        user.setHeight(request.height());
        user.setWeight(request.weight());
        user.setRegdate(LocalDateTime.now());
        usersRepository.save(user);
    }

    public boolean duplicateCheck(String userId) {
        return usersRepository.existsByUserId(userId);
    }
}
