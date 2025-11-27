package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
    // 아이디 존재 여부
    boolean existsByUserId(String userId);
}
