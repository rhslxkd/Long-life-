package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UsersRepository extends JpaRepository<Users, String> {
    @Query("""
        select u from Users u
        where u.userId like %:value%
        and u.userId <> :excludeUserId
        and u.role <> 'ROLE_ADMIN'
        and not exists (
            select 1 from Friend f
            where :excludeUserId in (f.requester.userId, f.receiver.userId)
            and u.userId in (f.requester.userId, f.receiver.userId)
            and f.status in (
              com.oraclejava.longlife.model.FriendStatus.PENDING,
              com.oraclejava.longlife.model.FriendStatus.ACCEPTED
            )
        )
    """)
    List<Users> searchUsers(String value, String excludeUserId);
}
