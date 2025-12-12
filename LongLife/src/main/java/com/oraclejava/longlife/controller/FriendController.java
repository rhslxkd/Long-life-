package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.FriendRequestDto;
import com.oraclejava.longlife.dto.FriendResponseDto;
import com.oraclejava.longlife.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/friends")
public class FriendController {
    private final FriendService friendService;

    // 친구 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchFriend(@RequestParam String value,
                                          @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(friendService.searchUsers(value, user.getUsername()));
    }

    // 친구 요청
    @PostMapping("/request")
    public FriendResponseDto sendRequest(@RequestBody FriendRequestDto friendRequestDto) {
        return friendService.sendRequest(friendRequestDto);
    }

    // 요청 수락
    @PostMapping("/{friendId}/accept")
    public FriendResponseDto acceptRequest(@PathVariable Long friendId) {
        return friendService.acceptRequest(friendId);
    }

    // 요청 거절
    @PostMapping("/{friendId}/reject")
    public FriendResponseDto rejectRequest(@PathVariable Long friendId) {
        return friendService.rejectRequest(friendId);
    }

    // 친구 목록
    @GetMapping
    public ResponseEntity<?> getFriends(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(friendService.getFriends(user.getUsername()));
    }

    // 친구 삭제
    @DeleteMapping("/{friendId}")
    public ResponseEntity<?> deleteFriend(@PathVariable Long friendId) {
        friendService.deleteFriend(friendId);
        return ResponseEntity.ok().build();
    }

    // 요청 목록
    @GetMapping("/requests")
    public ResponseEntity<?> getFriendRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(friendService.getRequestFriends(user.getUsername()));
    }
}
