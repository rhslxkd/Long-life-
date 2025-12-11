package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Likes;
import com.oraclejava.longlife.model.Post;
import com.oraclejava.longlife.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Likes, Long> {
    Optional<Likes> findByPostAndUser(Post post, Users user);
    @Query("""
        select count(l) from Likes l
        where l.post = :post
        and l.isLike = true
    """)
    Long countByPost(Post post);
}
