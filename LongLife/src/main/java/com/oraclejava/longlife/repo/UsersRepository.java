package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UsersRepository extends JpaRepository<Users, String> {

}
