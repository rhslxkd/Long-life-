package com.oraclejava.longlife.controller;

import com.oraclejava.longlife.dto.LikesDto;
import com.oraclejava.longlife.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{postId}")
    public LikesDto likeToggle(@PathVariable long postId,
                               @AuthenticationPrincipal User user) {
        return likeService.likeToggle(postId, user.getUsername());
    }
}
