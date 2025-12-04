package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.ForAdminUserDto;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {
    private final UsersRepository usersRepository;
    
    // 유저 목록
    List<ForAdminUserDto> getUsers() {
        return usersRepository.findAll()
                .stream()
                .map((u) -> new ForAdminUserDto(
                        u.getUserId(),
                        u.getEmail(),
                        u.getName(),
                        u.getRegdate()
                ))
                .toList();
    }
}
