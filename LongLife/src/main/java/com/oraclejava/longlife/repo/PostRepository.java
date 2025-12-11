package com.oraclejava.longlife.repo;

import com.oraclejava.longlife.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

       //운동 스토리 전체
       @Query("""
          SELECT p FROM Post p WHERE 1=1 order by p.postId desc
          """)
       List<Post> findAll();



       @Query("""
              SELECT p FROM Post p
              WHERE (:searchData IS NULL OR p.title LIKE %:searchData%)
              OR (:searchData IS NULL OR p.content LIKE %:searchData%)
             """)
       List<Post> findSearchTitleContent(
               @Param("searchData") String searchData
       );

       // 관리자용 스토리 검색
       @Query("""
            select p from Post p
            where p.title LIKE %:searchData%
            or p.userId LIKE %:searchData%
        """)
       Page<Post> findByTitleOrUserId(String searchData, Pageable pageable);

       // 친구 스토리 가져오기
       Page<Post> findByUserIdIn(List<String> userIds, Pageable pageable);

       // 친구 스토리 최신 3가지 가져오기
       List<Post> findTop3ByUserIdInOrderByCreatedAtDesc(List<String> userIds);
}
