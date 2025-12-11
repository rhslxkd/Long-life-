package com.oraclejava.longlife.repo;
import com.oraclejava.longlife.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost_PostId(Long postId);
    List<Comment> findByParent_CommentId(Long parentId);
}
