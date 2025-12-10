package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.*;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    // 회원가입
    public void register(RegisterRequest request) {
        // 아이디 중복 체크
        if (usersRepository.existsById(request.userId())) {
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
        user.setRole("ROLE_USER");
        usersRepository.save(user);
    }

    // 아이디 중복확인
    public boolean duplicateCheck(String userId) {
        return usersRepository.existsById(userId);
    }

    // 로그인
    public MeResponse login(LoginRequest req, HttpServletRequest request, HttpServletResponse response) {
        // 인증 토큰 생성
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(req.userId(), req.password());
        // 로그인
        Authentication auth = authenticationManager.authenticate(token);

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(auth);

        // JSESSIONID 발급 확정
        securityContextRepository.saveContext(context, request, response);

        Users user = usersRepository.findById(req.userId()).orElseThrow();
        return new MeResponse(user.getUserId(), user.getName(), user.getRole());
    }

    // 로그아웃
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession(false);

        if (request.getSession(false) != null) {
            request.getSession().invalidate();
        }

        SecurityContextHolder.clearContext();

        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
    }

    // 회원 수
    public long getUserCount() {
        return usersRepository.count();
    }

    // 회원 정보
    public UserResponseDto getUser(String userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다."));

        return new UserResponseDto(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getAddress(),
                user.getHeight(),
                user.getWeight(),
                user.getRegdate()
        );
    }

    // 회원 수정
    public UserResponseDto updateUser(String userId, UserUpdateDto updateDto) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다."));

        user.setName(updateDto.name());
        user.setEmail(updateDto.email());
        user.setAddress(updateDto.address());
        user.setHeight(updateDto.height());
        user.setWeight(updateDto.weight());

        return new UserResponseDto(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getAddress(),
                user.getHeight(),
                user.getWeight(),
                user.getRegdate()
        );
    }

    // 회원 탈퇴
    public void userDelete(String userId, HttpServletRequest request, HttpServletResponse response) {
        if (usersRepository.existsById(userId)) {
            usersRepository.deleteById(userId);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자 정보를 찾을 수 없습니다.");
        }

        if (request.getSession(false) != null) {
            request.getSession().invalidate();
        }

        SecurityContextHolder.clearContext();

        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);
    }
}
