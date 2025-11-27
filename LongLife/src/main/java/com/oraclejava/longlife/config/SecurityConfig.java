package com.oraclejava.longlife.config;

import com.oraclejava.longlife.model.Users;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.time.LocalDateTime;

@Configuration
public class SecurityConfig {

    @Bean
    public Users adminUser() {
        Users admin = new Users();
        admin.setUserId("admin");
        admin.setEmail("admin@example.com");
        admin.setName("관리자");
        admin.setPassword("{noop}1234"); // 인메모리라면 {noop} 가능
        admin.setAddress("서울시 강남구");
        admin.setHeight(175);
        admin.setWeight(70);
        admin.setRegdate(LocalDateTime.now());
        return admin;
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("1234")) // 임시 비밀번호
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 모든 요청 허용
                )
                .csrf(csrf -> csrf.disable()); // 개발 편의상 CSRF 비활성화

        return http.build();
    }
}
