package com.oraclejava.longlife.service;

import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findById(username).orElseThrow(() -> new UsernameNotFoundException("사용자을 찾을 수 없습니다."));

        // 조회한 사용자 정보를 UserDetails 객체로 변환 후 반환
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUserId())
                .password(user.getPassword())
                .authorities(user.getRole())
                .build();
    }
}
