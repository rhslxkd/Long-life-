package com.oraclejava.longlife.service;

import com.oraclejava.longlife.dto.LikesDto;
import com.oraclejava.longlife.model.Likes;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.model.Users;
import com.oraclejava.longlife.repo.LikeRepository;
import com.oraclejava.longlife.repo.PostRepository;
import com.oraclejava.longlife.repo.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {
    private final LikeRepository likerepository;
    private final PostRepository postrepository;
    private final UsersRepository usersrepository;

    public LikesDto likeToggle(long postId, String userId) {
        Post post = postrepository.findById(postId).orElseThrow(() -> new RuntimeException("스토리를 찾을 수 없습니다."));
        Users user = usersrepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Optional<Likes> exist= likerepository.findByPostAndUser(post, user);
        Likes like;

        if (exist.isPresent()) {
            like = exist.get();
            like.setLike(!like.isLike());
        } else {
            like = new Likes();
            like.setUser(user);
            like.setPost(post);
            like.setLike(true);
        }

        Likes saved = likerepository.save(like);

        return new LikesDto(
                saved.getLikeId(),
                saved.getPost().getPostId(),
                saved.getUser().getUserId(),
                saved.getCreatedAt(),
                saved.isLike()
        );
    }
}
