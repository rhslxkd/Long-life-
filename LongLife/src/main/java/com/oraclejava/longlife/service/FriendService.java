package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.FriendDto;
import com.oraclejava.longlife.dto.FriendRequestDto;
import com.oraclejava.longlife.dto.FriendResponseDto;
import com.oraclejava.longlife.dto.SearchUserDto;
import com.oraclejava.longlife.model.Friend;
import com.oraclejava.longlife.model.FriendStatus;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.FriendRepository;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendService {
    private final FriendRepository friendRepository;
    private final UsersRepository usersRepository;

    // 친구 검색
    public List<SearchUserDto> searchUsers(String value, String excludeUserId) {
        return usersRepository.searchUsersForFriend(value, excludeUserId)
                .stream().map(user -> new SearchUserDto(
                        user.getUserId(),
                        user.getName()
                ))
                .toList();
    }

    // 친구 요청
    public FriendResponseDto sendRequest(FriendRequestDto friendRequestDto) {

        Users requester = usersRepository.findById(friendRequestDto.requesterId())
                .orElseThrow(() -> new RuntimeException("요청자를 찾을 수 없습니다."));
        Users receiver = usersRepository.findById(friendRequestDto.receiverId())
                .orElseThrow(() -> new RuntimeException("수신자를 찾을 수 없습니다."));

        Friend friend = new Friend();
        friend.setRequester(requester);
        friend.setReceiver(receiver);
        friend.setStatus(FriendStatus.PENDING);

        Friend saved = friendRepository.save(friend);

        return new FriendResponseDto(saved.getFriendId(), saved.getRequester().getUserId(), saved.getStatus().name());
    }

    // 요청 수락
    public FriendResponseDto acceptRequest(Long friendId) {
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("친구 요청을 찾을 수 없습니다."));
        friend.setStatus(FriendStatus.ACCEPTED);
        Friend saved = friendRepository.save(friend);
        return new FriendResponseDto(saved.getFriendId(), saved.getRequester().getUserId(), saved.getStatus().name());
    }

    // 요청 거절
    public FriendResponseDto rejectRequest(Long friendId) {
        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("친구 요청을 찾을 수 없습니다."));
        friend.setStatus(FriendStatus.REJECTED);
        Friend saved = friendRepository.save(friend);
        return new FriendResponseDto(saved.getFriendId(), saved.getRequester().getUserId(), saved.getStatus().name());
    }

    // 친구 목록
    public List<FriendDto> getFriends(String userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<FriendDto> requestFriends = friendRepository.findByRequesterAndStatus(user, FriendStatus.ACCEPTED)
                .stream()
                .map(f -> new FriendDto(
                        f.getFriendId(),
                        f.getRequester().getUserId(),
                        f.getRequester().getName(),
                        f.getReceiver().getUserId(),
                        f.getReceiver().getName(),
                        f.getStatus().name(),
                        f.getCreatedAt()))
                .toList();

        List<FriendDto> receiverFriends = friendRepository.findByReceiverAndStatus(user, FriendStatus.ACCEPTED)
                .stream()
                .map(f -> new FriendDto(
                        f.getFriendId(),
                        f.getReceiver().getUserId(),
                        f.getReceiver().getName(),
                        f.getRequester().getUserId(),
                        f.getRequester().getName(),
                        f.getStatus().name(),
                        f.getCreatedAt()))
                .toList();

        List<FriendDto> allFriends = new ArrayList<>();
        allFriends.addAll(requestFriends);
        allFriends.addAll(receiverFriends);

        return allFriends;
    }

    // 친구 삭제
    public void deleteFriend(Long friendId) {
        friendRepository.deleteById(friendId);
    }

    // 요청 받은 목록
    public List<FriendDto> getRequestFriends(String userId) {
        List<FriendDto> requests = friendRepository.findByReceiverUserIdAndStatusOrderByCreatedAtDesc(userId, FriendStatus.PENDING)
                .stream()
                .map(f -> new FriendDto(
                        f.getFriendId(),
                        f.getReceiver().getUserId(),
                        f.getReceiver().getName(),
                        f.getRequester().getUserId(),
                        f.getRequester().getName(),
                        f.getStatus().name(),
                        f.getCreatedAt()))
                .toList();

        return requests;
    }
}











