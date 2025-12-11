package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.CommentRequestDto;
import com.oraclejava.longlife.model.Comment;
import com.oraclejava.longlife.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    /* 댓글 저장 */
    @PostMapping
    public ResponseEntity<?> save(@RequestBody CommentRequestDto dto) {
        commentService.saveComment(dto);
        return ResponseEntity.ok("saved");
    }

    /* 특정 게시글의 댓글 트리 조회 */
    @GetMapping("/{postId}")
    public ResponseEntity<?> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

}
