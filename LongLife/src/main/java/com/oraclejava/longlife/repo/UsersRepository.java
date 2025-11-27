package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UsersRepository extends JpaRepository<Users, String> {
    // 아이디 존재 여부
    boolean existsByUserId(String userId);
}
