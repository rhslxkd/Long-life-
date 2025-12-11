package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.CommentRequestDto;
import com.oraclejava.longlife.dto.CommentResponseDto;
import com.oraclejava.longlife.model.Comment;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.CommentRepository;
import com.oraclejava.longlife.repo.PostRepository;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UsersRepository usersRepository;

    @Transactional
    public void saveComment(CommentRequestDto commentRequestDto) {
        Post post = postRepository.findById(commentRequestDto.postId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Users user = usersRepository.findById(commentRequestDto.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment parent = null;
        if (commentRequestDto.parentId() != null) {
            parent = commentRepository.findById(commentRequestDto.parentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(commentRequestDto.content())
                .parent(parent)
                .build();

        commentRepository.save(comment);
    }


    /* 댓글 + 대댓글 트리로 변환 */
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentsByPost(Long postId) {

        List<Comment> comments = commentRepository.findByPost_PostId(postId);

        // 1. id → CommentResponseDto 매핑
        Map<Long, CommentResponseDto> map = new HashMap<>();
        for (Comment c : comments) {
            map.put(c.getCommentId(), new CommentResponseDto(
                    c.getCommentId(),
                    c.getUser().getUserId(),
                    c.getContent(),
                    c.getCreatedAt().toString(),
                    c.getParent() != null ? c.getParent().getCommentId() : null,
                    new ArrayList<>()
            ));
        }

        // 2. 트리 구조 생성
        List<CommentResponseDto> result = new ArrayList<>();

        for (Comment c : comments) {
            if (c.getParent() == null) {
                result.add(map.get(c.getCommentId()));
            } else {
                CommentResponseDto parentDto = map.get(c.getParent().getCommentId());
                parentDto.children().add(map.get(c.getCommentId()));
            }
        }

        return result;
    }


}


