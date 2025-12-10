package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.ForAdminPostDto;
import com.oraclejava.longlife.dto.ForAdminUserDto;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.PostRepository;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {
    private final UsersRepository usersRepository;
    private final PostRepository postRepository;
    
    // 유저 목록
    public Page<ForAdminUserDto> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("userId").descending());
        Page<Users> users = usersRepository.findAll(pageable);

        return users.map((u) -> new ForAdminUserDto(
                u.getUserId(),
                u.getEmail(),
                u.getName(),
                u.getRegdate(),
                u.getRole()
            )
        );
    }
    
    // 유저 검색 목록
    public Page<ForAdminUserDto> getSearchUsers(String searchData, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("userId").descending());
        Page<Users> users = usersRepository.findByUserIdContaining(searchData, pageable);

        return users.map((u) -> new ForAdminUserDto(
                u.getUserId(),
                u.getEmail(),
                u.getName(),
                u.getRegdate(),
                u.getRole()
            )
        );
    }

    // 유저 삭제
    public void UserDelete(String userId) {
        if (usersRepository.existsById(userId)) {
            usersRepository.deleteById(userId);
        } else {
            throw new RuntimeException("유저 정보를 찾을 수 없습니다.");
        }
    }

    // 스토리 목록
    public Page<ForAdminPostDto> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postId").descending());
        Page<Post> posts = postRepository.findAll(pageable);

        return posts.map((p) -> new ForAdminPostDto(
                p.getPostId(),
                p.getUserId(),
                p.getTitle(),
                p.getCreatedAt(),
                p.getUpdatedAt()
            )
        );
    }

    // 스토리 검색 목록
    public Page<ForAdminPostDto> getSearchPosts(String searchData, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("postId").descending());
        Page<Post> posts = postRepository.findByTitleOrUserId(searchData, pageable);

        return posts.map((p) -> new ForAdminPostDto(
                p.getPostId(),
                p.getUserId(),
                p.getTitle(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        ));
    }
}
