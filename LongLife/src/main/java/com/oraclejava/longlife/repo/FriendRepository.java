package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Friend;
import com.oraclejava.longlife.model.FriendStatus;
import com.oraclejava.longlife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {
    List<Friend> findByRequesterAndStatus(Users requester, FriendStatus status);
    List<Friend> findByReceiverAndStatus(Users receiver, FriendStatus status);
    List<Friend> findByReceiverUserIdAndStatusOrderByCreatedAtDesc(String receiverUserId, FriendStatus status);
}
